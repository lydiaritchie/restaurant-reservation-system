import React, {  useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Page to create a new reservation.
 */

function NewReservations() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  //States to track inputs and errors
  const [formData, setFormData] = useState({ ...initialFormState });


  //handle change to form inputs
  function handleChange({ target }) {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
  }

  async function handleSubmit(event){
    event.preventDefault();
    setFormData({
      ...formData,
      "people": Number(formData.people),
    })
        try{
            await createReservation(formData);
            history.push(`/dashboard?date=${formData.reservation_date}`);
        } catch (error) {
            console.log(error);
            ErrorAlert();
        }
  }

  return (
    <main>
      <h4>Create Reservation</h4>
      <form className="col" onSubmit={handleSubmit}>
        <label className="form-components">
          First Name:
          <input
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </label>

        <label className="form-components">
          Last Name:
          <input
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </label>

        <label className="form-components fs-5">
          Phone Number:
          <input
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
        </label>

        <label className="form-components">
          Date:
          <input
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </label>

        <label className="form-components">
          Time:
          <input
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </label>

        <label className="form-components">
          Number of people:
          <input
            name="people"
            type="number"
            min="0"
            onChange={handleChange}
            value={formData.people}
            required
          />
        </label>

        <div className="buttons justify-content-between">
          <button className="btn btn-light" type="button" onClick={() => history.goBack()} >Cancel</button>
          <button className="btn purple-button" type="submit">Submit</button>
        </div>
      </form>
    </main>
  );
}

export default NewReservations;
