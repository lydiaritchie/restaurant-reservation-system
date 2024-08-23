import React, { useEffect, useState } from "react";
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
    people: 0,
  };

  //States to track inputs and errors
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errorMessages, setErrorMessages] = useState({});

  //handle change to form inputs
  function handleChange({ target }) {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    setErrorMessages(validateInputs(formData));
    console.log(target.name + ": " + target.value);
  }

  //validate inputs and handle errors
  function validateInputs(formData){
    let errors = {};
    //conditional statement for dashes?
    if(formData.mobile_number.length > 10 || formData.mobile_number.length < 10){
      //  errors.mobile_number = true;
    }
    const today = new Date().toISOString().split('T')[0]
    console.log("today: ", today);
    console.log("reservation_date: ", formData.reservation_date);
    return errors;
  }

  async function handleSubmit(event){
    event.preventDefault();
    if(!Object.values(errorMessages).includes(true)){
        try{
            await createReservation(formData);
            history.push("/dashboard");
        } catch (error) {
            console.log(error);
            //ErrorAlert();
        }
        
    }

  }

  return (
    <main>
      <h2>Create Reservation</h2>
      <form className="col" onSubmit={handleSubmit}>
        <label className="form-components">
          First Name:
          <input
            name="first_name"
            onChange={handleChange}
            value={formData.name}

          />
        </label>

        <label className="form-components">
          Last Name:
          <input
            name="last_name"
            onChange={handleChange}
            value={formData.name}

          />
        </label>

        <label className="form-components fs-5">
          Phone Number:
          <input
            name="mobile_number"
            onChange={handleChange}
            value={formData.name}

          />
          {errorMessages["mobile_number"] ? 
          (<small className="alert alert-danger">Must be 10 digits long</small>) : <></>}
        </label>

        <label className="form-components">
          Date:
          <input
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.name}
            min={new Date().toISOString().split('T')[0]}

          />
        </label>

        <label className="form-components">
          Time:
          <input
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={formData.name}

          />
        </label>

        <label className="form-components">
          Number of people:
          <input
            name="people"
            type="number"
            min="0"
            onChange={handleChange}
            value={formData.name}

          />
        </label>

        <div className="buttons justify-content-between">
          <button className="btn btn-light" onClick={() => history.goBack()} >Cancel</button>
          <button className="btn purple-button">Submit</button>
        </div>
      </form>
    </main>
  );
}

export default NewReservations;
