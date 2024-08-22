import React, { useEffect, useState } from "react";
//import ErrorAlert from "../layout/ErrorAlert";

/**
 * Page to create a new reservation.
 */

function NewReservations() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  
  const [formData, setFormData] = useState({ ...initialFormState });

  //handle change to form inputs
  function handleChange({ target }) {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
    console.log(target.name + ": " + target.value);
  }

  return (
    <main>
      <h2>Create Reservation</h2>
      <form className="col">
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
            maxLength={10}
          />
        </label>

        <label className="form-components">
          Date:
          <input
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.name}
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
          <button className="btn btn-light">Cancel</button>
          <button className="btn purple-button">Submit</button>
        </div>
      </form>
    </main>
  );
}

export default NewReservations;
