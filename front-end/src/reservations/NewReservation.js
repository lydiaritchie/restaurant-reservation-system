import React, { useState } from "react";
import ReservationForm from "./ReservationForm";

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


  return (
    <main className="helvetica">
      <h3 className="date-title m-3">Create Reservation</h3>
      <div>
        <ReservationForm initialFormState={initialFormState}/>
      </div>
    </main>
  );
}

export default NewReservations;
