import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  deleteTableReservation,
  setReservationCancel,
} from "../utils/api";
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
  const [seatError, setSeatError] = useState(null);

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

  async function handleFinish(table_id) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      console.log("finished");
      try {
        await deleteTableReservation(table_id);
        loadDashboard();
      } catch (error) {
        console.log(error);
        setSeatError(error);
      }
    }
  }

  async function handleCancel(event, reservation_id){
    console.log(event);
    event.target.blur();
    if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")){
      console.log("cancelled");
      try{
        await setReservationCancel(reservation_id);
        loadDashboard();
      } catch(error){
        console.log(error);
        setReservationsError(error);
      }
    }
  }

  const reservationCards = reservations.map((reservation) => {
    const date = next(reservation.reservation_date);
    const reservation_id = reservation.reservation_id;
    return (
      <li
        key={reservation.reservation_id}
        className="shadow-sm list-group-item"
      >
        <div className="d-flex row justify-content-between reservation-cards text-wrap">
          <div className="col-9">
            <div className="d-flex">
              <h5 className="mr-3">
                {reservation.first_name} {reservation.last_name}
              </h5>

              <div
                className="mb-1 align-self-center py-0 px-1 font-italic booked"
                data-reservation-id-status={reservation.reservation_id}
              >
                {reservation.status}
              </div>
            </div>

            <div className="mt-1 font-weight-bold">
              {reservation.reservation_time.slice(0, 5)}
            </div>
            {reservation.people > 1 ? (
              <>{reservation.people} people</>
            ) : (
              <>{reservation.people} person</>
            )}
            <div className="fs-5">{formatDate(date)}</div>
            <div className="font-italic">{reservation.mobile_number}</div>
          </div>

          <div className="d-flex col-3 flex-column align-items-end">
            <div className="">ID: {reservation.reservation_id}</div>
            <Link
              className="btn submit-button mt-auto"
              to={`/reservations/${reservation.reservation_id}/seat`}
            >
              Seat
            </Link>

            <div className="d-flex mt-auto align-items-baseline">
              <a
                className="mr-3 edit-button"
                href={`/reservations/${reservation.reservation_id}/edit`}
              >
                Edit
              </a>
              <button
                className="btn btn-outline-danger py-0 ml-1"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={(event) => handleCancel(event, reservation.reservation_id)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  });

  const tableCards = tables.map((table) => {
    return (
      <li key={table.table_id} className="shadow-sm list-group-item">
        <div className="d-flex row g-0 justify-content-between reservation-cards text-wrap">
          <div className="col-5">
            <div className="mb-1">Table: {table.table_name}</div>
            <div className="">Capacity: {table.capacity}</div>
          </div>

          <div className="col-4 px-1 align-self-center justify-content-center">
            {table.reservation_id != null ? (
              <div
                className="align-self-center text-muted"
                data-table-id-status={table.table_id}
              >
                Occupied
              </div>
            ) : (
              <div
                className="font-weight-bold align-self-center"
                data-table-id-status={table.table_id}
              >
                Free
              </div>
            )}
          </div>

          <div className="col-3 d-flex flex-column">
            {table.reservation_id ? (
              <div className="justify-content-center d-flex">
                <button
                  className="btn submit-button align-self-center"
                  data-table-id-finish={table.table_id}
                  onClick={() =>
                    handleFinish(table.table_id, table.reservation_id)
                  }
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
            <ul className="list-group mt-3 ml-3 flex-grow-1">
              <div className="row mx-2 justify-content-between">
                <h4>Reservations:</h4>
                <a href="#tables" className="d-md-none">
                  Tables ↓
                </a>
              </div>
              {reservationCards}
            </ul>

            <ul id="tables" className="list-group mt-3 ml-3 flex-grow-1">
              <h4>Tables:</h4>
              {tableCards}
            </ul>
          </div>
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={seatError} />
    </main>
  );
}

export default Dashboard;
