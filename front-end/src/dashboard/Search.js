import React from "react";
import { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useLocation, Link } from "react-router-dom";
import { getReservationByMobileNum } from "../utils/api";
import { next } from "../utils/date-time";

/**
 * Defines the search page.
 */
function Search() {
  const [inputNumber, setInputNumber] = useState("");
  const [inputError, setInputError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const location = useLocation();
  const history = useHistory();

  async function handleChange({ target }) {
    console.log(target.value);
    setInputNumber(target.value);
  }

  function formatMobileNumber(mobileNumber) {
    const dashedFormat = /^\d{3}-\d{3}-\d{4}$/;
    if (dashedFormat.test(mobileNumber)) {
      return mobileNumber;
    }
    const clean = mobileNumber.replace(/\D/g, "");
    return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
  }

  async function loadResults(formattedNum) {
    const abortController = new AbortController();

    try {
      const fetchedResults = await getReservationByMobileNum(
        formattedNum,
        abortController.signal
      );
      console.log("fetchedResults: ", fetchedResults);
      setReservations(fetchedResults);
    } catch (error) {
      setInputError(error);

    }
    return () => abortController.abort();
  }

  //format the date for displaying on the top of the page
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  //submit get request to reservations
  async function handleSubmit(event) {
    event.preventDefault();
    console.log("submitted");

    const formattedNum = formatMobileNumber(inputNumber);
    console.log("formateed Num: ", formattedNum);

    history.push(`${location.pathname}?mobile_number=${formattedNum}`);

    await loadResults(formattedNum);
    setIsSubmitted(true);
  }

  const reservationCards = reservations.map((reservation) => {
    const date = next(reservation.reservation_date);
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
            <a
              className="mt-auto edit-button"
              href={`/reservations/${reservation.reservation_id}/edit`}
            >
              Edit
            </a>
          </div>
        </div>
      </li>
    );
  });

  //reservation cards mapped out

  return (
    <main className="helvetica">
      <div className="d-flex-row mb-3 search-title align-items-center">
        <h4 className="date-title">Search</h4>

        <div className="container">
          <form className="search-div" onSubmit={handleSubmit}>
            <input
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              className="search-input"
              onChange={handleChange}
              required
            />

            <button className="btn  submit-button ml-2 py-1" type="submit">
              Find
            </button>
          </form>

          <div className="d-flex flex-column flex-md-row mt-2">
            <ul className="list-group list ml-3 flex-grow-1">
              {reservationCards}
            </ul>
            
          </div>

          {isSubmitted && reservations.length === 0 ? (
            <h5 className="alert alert-danger">No reservations found</h5>
          ) : (
            <></>
          )}
        </div>

        {inputError ? (
          <div>
            <ErrorAlert error={inputError} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
}

export default Search;
