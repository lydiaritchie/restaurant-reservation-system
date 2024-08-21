import React, { useEffect, useState } from "react";
//import ErrorAlert from "../layout/ErrorAlert";

/**
 * Page to create a new reservation.
 */

function NewReservations() {
  return (
    <main>
      <h2>Create Reservation</h2>
      <form className="col">
        <label className="form-components">
          First Name:
          <input name="first_name" />
        </label>

        <label className="form-components">
          Last Name:
          <input name="last_name" />
        </label>

        <label className="form-components">
          Phone Number:
          <input name="mobile_number" />
        </label>

        <label className="form-components">
          Date:
          <input 
          name="reservation_date" 
          type="date"
          />
        </label>

        <label className="form-components">
          Time:
          <input name="reservation_time" type="time" />
        </label>

        <label className="form-components">
          Number of people:
          <input 
          name="people"
          type="number"
          min="0"
           />
        </label>

        <div className="buttons justify-content-between">
          <button className="btn btn-light">Cancel</button>
          <button className="btn btn-primary">Submit</button>
        </div>

      </form>
    </main>
  );
}

export default NewReservations;
