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
    date = dateString;
    history.push(`${location.pathname}?date=${dateString}`);
  }

  const reservationCards = reservations.map((r) => {
    return (
      <li
        key={r.reservation_id}
        className="shadow-sm list-group-item reservation-cards text-center"
      >
        <div className="">
          <h5 className="">
            {r.first_name} {r.last_name}
          </h5>
          <p className=" ">
            {r.reservation_time} on {formatDate(r.reservation_date)}
          </p>
          {r.people > 1 ? <>{r.people} people</> : <>{r.people} person</>}
        </div>
      </li>
    );
  });

  //format the date for displaying on the top of the page
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <main className="helvetica">
      <div className="d-flex-row mb-3">
        <div className="dash-title">
          <h5 className="text-muted">Dashboard</h5>
          <h4 className="">{formatDate(date)}</h4>
        </div>
        <div className="d-flex justify-content-center">
          <div
            className=" rounded-3 dash-btns btn"
            onClick={() => {
              updateQuery(0);
            }}
          >
            ← Back
          </div>
          <div
            className="dash-btns btn mx-2"
            onClick={() => {
              updateQuery(today());
            }}
          >
            Today
          </div>
          <div
            className="dash-btns btn"
            onClick={() => {
              updateQuery(1);
            }}
          >
            Next →
          </div>
        </div>
        <ul className="list-group list">{reservationCards}</ul>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
