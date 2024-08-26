import React, {  useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

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
    people: 0,
  };

  //States to track inputs and errors
  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState("");

  //handle change to form inputs
  function handleChange({ target }) {
      if(target.name === "reservation_date"){
        const dateObj = new Date(target.value);
        if(target.value < today()){
          setError("Cannot book in the past.");
        }
        else if(dateObj.getDay() === 2){
          setError("Cannot book on Tuesdays.");
        } else {
          setError(false);
        }
      }
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
  }

  async function handleSubmit(event){
    event.preventDefault();
    const newReservation  = {
      ...formData,
      people: Number(formData.people),
    };
        try{
            await createReservation(newReservation);
            history.push(`/dashboard?date=${formData.reservation_date}`);
        } catch (error) {
            console.log(error);
            ErrorAlert(error);
        }
  }

  return (
    <main className="work-sans">
      <h3 className="date-title m-3">Create Reservation</h3>
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
        {error ? 
          (<div className="alert alert-danger">
            {error}
          </div>) : <></>}
        
        <div className="buttons d-flex justify-content-between">
          <button className="btn btn-outline-dark w-100 " type="button" onClick={() => history.goBack()} >Cancel</button>
          <button className="btn submit-button w-100 ml-2" type="submit">Submit</button>
        </div>
      </form>
    </main>
  );
}

export default NewReservations;
