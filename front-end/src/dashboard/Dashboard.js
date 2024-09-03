import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { useLocation, useHistory, Link } from "react-router-dom";
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
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
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

  function handleFinish(event) {
    if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      console.log("finished");
    }
  }

  const reservationCards = reservations.map((r) => {
    const date = next(r.reservation_date);
    return (
      <li key={r.reservation_id} className="shadow-sm list-group-item">
        <div className="d-flex row justify-content-between reservation-cards text-wrap">
          <div className="col-9">
            <h5 className="">
              {r.first_name} {r.last_name}
            </h5>

            <div className="mt-1 font-weight-bold">
              {r.reservation_time.slice(0, 5)}
            </div>
            {r.people > 1 ? <>{r.people} people</> : <>{r.people} person</>}
            <div className="fs-5">{formatDate(date)}</div>
            <div className="font-italic">{r.mobile_number}</div>
          </div>

          <div className="d-flex col-3 flex-column id">
            <div className="">ID: {r.reservation_id}</div>
            <Link
              className="btn submit-button mt-auto"
              to={`/reservations/${r.reservation_id}/seat`}
            >
              Seat
            </Link>
          </div>
        </div>
      </li>
    );
  });

  const tableCards = tables.map((t) => {
    return (
      <li key={t.table_id} className="shadow-sm list-group-item">
        <div className="d-flex row g-0 justify-content-between reservation-cards text-wrap">

          <div className="col-5">
            <div className="mb-1">Table: {t.table_name}</div>
            <div className="">Capacity: {t.capacity}</div>
          </div>

          <div className="col-4 px-1 align-self-center justify-content-center">
            {t.reservation_id != null ? (
              <div className="align-self-center text-muted">Occupied</div>
            ) : (
              <div className="font-weight-bold align-self-center">Free</div>
            )}
          </div>

          <div className="col-3 d-flex flex-column" data-table-id-status={t.table_id}>
            {t.reservation_id ? (
              <div className="justify-content-center d-flex">
                <button
                  className="btn submit-button align-self-center"
                  data-table-id-finish={t.table_id}
                  onClick={handleFinish}
                >
                  Finish
                </button>
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>

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
        <div className="dash-title row align-items-center">
          <h5 className="text-muted">Dashboard</h5>
          <h4 className="date-title">{formatDate(date)}</h4>

          <div className="justify-content-center">
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
        </div>

        <div className="container">
          <div className="d-flex flex-column flex-md-row">
            <ul className="list-group list ml-3 flex-grow-1">
              <div className="row mx-2 justify-content-between">
                <h4>Reservations:</h4>
                <a href="#tables" className="d-md-none">
                  Tables ↓
                </a>
              </div>
              {reservationCards}
            </ul>

            <ul id="tables" className="list-group list ml-3 flex-grow-1">
              <h4>Tables:</h4>
              {tableCards}
            </ul>
          </div>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;
