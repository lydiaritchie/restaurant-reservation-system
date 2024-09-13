import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, listTables, setTableReservation } from "../utils/api";
import { next } from "../utils/date-time";

function SeatReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [reservationError, setReservationError] = useState(null);
  const [selectionError, setSelectionError] = useState(null);
  const [commonError, setCommonError] = useState(null);

  //useEffect to get the current reservation
  useEffect(() => {
    const abortController = new AbortController();

    const fetchReservationAndTables = async () => {
      try {
        setReservationError(null);
        const reservationData = await getReservation(
          reservation_id,
          abortController.signal,
        );

        setReservation(reservationData);

        const tablesData = await listTables(abortController.signal);
        setTables(tablesData);
      } catch (error) {
        if (error.name !== "AbortError") {
          setReservationError(error.message);
          setTablesError(error);
        }
      }
    };

    fetchReservationAndTables();

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
      <option key={t.table_id} value={t.table_id} data-capacity={t.capacity}>
        {t.table_name} - {t.capacity}
      </option>
    );
  });

  //handle change
  async function handleChange({ target }) {
    if (target.value === "select") {
      return setSelectionError("Please select a table");
    } else {
      setSelectionError(null);
      setTablesError(null);
      setReservationError(null);
    }

    //check if the table is occupied or free
    const currentTable = tables.find((table) => {
      console.log(`${table.table_id} == ${target.value}`);
      return Number(table.table_id) === Number(target.value);
    });
    console.log(currentTable);

    const capacity =
      await target.options[target.selectedIndex].getAttribute("data-capacity");

    if (currentTable.reservation_id != null) {
      setTablesError("This table is already occupied");
    }
    //check if there are any errors, if they haven't selected anything or if the capacity is too large
    else if (target.value !== "select" && reservation.people > capacity) {
      setTablesError("Reservation capacity is greater table capacity.");
    } else {
      setTablesError(null);
    }

    setSelectedTableId(target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    //haven't selected a table yet
    if (
      selectedTableId === "select" ||
      selectedTableId === null ||
      selectedTableId === undefined
    ) {
      return setSelectionError("Please select a table");
    } else {
      setSelectionError(null);
    }

    if (
      tablesError === null &&
      reservationError === null &&
      selectionError === null
    ) {
      try {
        const reservationId = reservation.reservation_id;
        const date = next(reservation.reservation_date.slice(0, 10));
        const reservationDate = date;
        await setTableReservation(selectedTableId, reservationId);
        history.push(`/dashboard/?date=${reservationDate}`);
      } catch (error) {
        console.log(error);
        setCommonError(error);
      }
    }
  }

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

            <div className="fs-5">
              {formatDate(reservation.reservation_date)}
            </div>
            <div className="font-italic">{reservation.mobile_number}</div>
          </div>

          <div className="d-flex col-3 flex-column id">
            <div className="">ID: {reservation.reservation_id}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <select name="table_id" onChange={handleChange} className="my-3">
          <option value="select">-- Select an Option --</option>
          {tableOptions}
        </select>

        <div className="buttons d-flex justify-content-between">
          <button
            className="btn btn-outline-dark w-100 "
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <button className="btn submit-button w-100 ml-2" type="submit">
            Submit
          </button>
        </div>
      </form>

      {reservationError ? (
        <div className="alert alert-danger">
          Reservations: {reservationError}
        </div>
      ) : (
        <></>
      )}
      {tablesError ? (
        <div className="mt-3 alert alert-danger">Tables: {tablesError}</div>
      ) : (
        <></>
      )}
      {selectionError ? (
        <div className="mt-3 alert alert-danger">{selectionError}</div>
      ) : (
        <></>
      )}
      <ErrorAlert error={commonError} />
    </main>
  );
}

export default SeatReservation;
