import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, listTables } from "../utils/api";

function SeatReservation() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservationError, setReservationError] = useState(null);

  //useEffect to get the current reservation
  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    getReservation(reservation_id, abortController.signal)
      .then((reservationData) => {
        console.log(reservationData);
        setReservation(reservationData[0]);
      })
      .catch(setReservationError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }, [reservation_id]);

  //format the date for displaying on the top of the page
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  //Map tables into options
  const tableOptions = tables.map((t) => {
    return (
      <option key={t.table_id}>
        {t.table_name} - {t.capacity}
      </option>
    );
  });

  return (
    <main>
      <h4 className="mt-2 date-title">Select Table</h4>
      <div
        key={reservation.reservation_id}
        className="shadow-sm list-group-item"
      >
        <div className="d-flex row justify-content-between align-items reservation-cards">
          <div className="col-9">
            <h5 className="">
              {reservation.first_name} {reservation.last_name}
            </h5>
            <div className="mt-1 font-weight-bold">
              {reservation.reservation_time}
            </div>
            {reservation.people > 1 ? (
              <>{reservation.people} people</>
            ) : (
              <>{reservation.people} person</>
            )}
            <div className="font-italic">{reservation.mobile_number}</div>
            <div className="fs-5">
              {formatDate(reservation.reservation_date)}
            </div>
            
          </div>

          <div className="d-flex col-3 flex-column id">
            <div className="">ID: {reservation.reservation_id}</div>
          </div>
        </div>
      </div>

      <div>
        <select name="table_id" className="mt-3">
          <option value="">-- Select an Option --</option>
          {tableOptions}
        </select>
      </div>
    </main>
  );
}

export default SeatReservation;
