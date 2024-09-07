import React, { useEffect, useState } from "react";
import ReservationForm from "./ReservationForm";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation } from "../utils/api";


/**
 * Defines editor page for reservations
 * @returns {JSX.Element}
 */
function EditReservations(){
  const {reservation_id} = useParams();
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "", // Use empty string for date
    reservation_time: "",
    people: 0,
  });

  //fetch the reservation
  useEffect(() => {
    let isMounted = true; // Flag to track whether the component is still mounted

    async function fetchReservation() {
      try {
        const fetchedReservation = await getReservation(reservation_id);
        const date = fetchedReservation.reservation_date.slice(0, 10); // Format date here
  
        if (isMounted) {
          setReservation({
            first_name: fetchedReservation.first_name,
            last_name: fetchedReservation.last_name,
            mobile_number: fetchedReservation.mobile_number,
            reservation_date: date, // Pass formatted date
            reservation_time: fetchedReservation.reservation_time,
            people: fetchedReservation.people,
          });
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
          ErrorAlert(error);
        }
      }
    }
  
    fetchReservation();
  
    // Cleanup function to run when the component unmounts
    return () => {
      isMounted = false; // Set the flag to false when unmounting
    };
  }, [reservation_id]);


    return (
        <main>
          <h3 className="date-title mt-3 text-center">Edit Reservation</h3>
          <div>
            <ReservationForm initialFormState={reservation}/>
          </div>
        </main>
    );
}

export default EditReservations;