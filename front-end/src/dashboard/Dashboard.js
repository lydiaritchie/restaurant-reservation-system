import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { useLocation, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const location = useLocation();
  const history = useHistory();
  const queryParams = useQuery();
  const queryDate = queryParams.get("date");

  if (queryDate) date = queryDate;
  
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

  function updateQuery(whereToGo) {
    let dateString;
    if (whereToGo === today()) {
      dateString = today();
    }
    //the new date should be one more than the current date
    if (whereToGo === 1) {
      dateString = next(date);
    }
    //go back one day
    if (whereToGo === 0) {
      dateString = previous(date);
    }
    
    history.push(`${location.pathname}?date=${dateString}`);
  }

  const reservationCards = reservations.map((r) => {
    return (
      <li key={r.reservation_id} className="list-group-item reservation-cards text-center">
        <div className="">
          <h5 className="">
            {r.first_name} {r.last_name}
          </h5>
          <p className=" ">
            {r.reservation_time} on {r.reservation_date}
          </p>
          {r.people > 1 ? <>{r.people} people</> : <>{r.people} person</>}
        </div>
      </li>
    );
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-flex-row mb-3 text-center">
        <h4 className="mb-0">Reservations for date:</h4>
        <h4>Today: {date}</h4>
        <div className="buttons justify-content-between">
          <button 
            className="btn m-1 purple-button"
            onClick={() => {
              updateQuery(0);
              loadDashboard();
            }}
            >Back </button>
          <button
            className="btn m-1 purple-button"
            onClick={() => {
              updateQuery(today());
              loadDashboard();
            }}
          >
            Today
          </button>
          <button 
            className="btn m-1 purple-button"
            onClick={() => {
              updateQuery(1);
              loadDashboard();
            }}
            >Next</button>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ul className="list-group">{reservationCards}</ul>
    </main>
  );
}

export default Dashboard;
