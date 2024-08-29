import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, listTables } from "../utils/api";
import { setTableReservation } from "../utils/api";

function SeatReservation() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  //option is an object {table_id: table_capactiy}
  const [option, setOption] = useState({});
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
      <option key={t.table_id} value={t.table_id} data-capacity={t.capacity}>
        Table: {t.table_name} Capacity: {t.capacity}
      </option>
    );
  });

  //handle change
  async function handleChange({ target }) {
    //check if capactiy can handle
    const capacity =
      target.options[target.selectedIndex].getAttribute("data-capacity");
    console.log(capacity);
    if (reservation.capacity > capacity) {
    }
    setOption(target.value);
  }

  //handle submit
  //set the forigen key to reservation_id
  //pass in the table_id and reservation_id
  async function handleSubmit(event) {
    event.preventDefault();
    console.log("submit");
    console.log("option:", option);
    try {
      await setTableReservation([option, reservation.restaurant_id]);
    } catch (error) {
      console.log(error);
      ErrorAlert(error);
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

      <form onSubmit={handleSubmit}>
        <select name="table_id" onChange={handleChange} className="my-3">
          <option value="">-- Select an Option --</option>
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
        <div className="alert alert-danger">reservationError</div>
      ) : (
        <></>
      )}
    </main>
  );
}

export default SeatReservation;
