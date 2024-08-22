import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationCards = reservations.map((r) => {
    return (
      <div className="card reservation-cards text-center">
        <div className="card-title p-2 purple">
          <h5 className="">
            {r.first_name} {r.last_name}
          </h5>
        </div>
        <div className="card-body p-1">
          <p className=" blue"> {r.reservation_time} on {r.reservation_date}</p>
          {r.people > 1 ? (<p>{r.people} people</p>) : (<p>{r.people} person</p>)}
        </div>
      </div>
    );
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="col">{reservationCards}</div>
    </main>
  );
}

export default Dashboard;
