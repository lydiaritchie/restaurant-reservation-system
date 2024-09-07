import React, { useState, useEffect } from "react";
import { today } from "../utils/date-time";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import { updateReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time";

/**
 * Form component for NewReservation and EditReservation
 */

function ReservationForm({ initialFormState, status }) {
  //the edit page or new reservation page will pass in the inital form state
  //States to track inputs and errors

  const { reservation_id } = useParams();
  console.log("reservation_id:", reservation_id);
  //has emtpy states to avoid unmounted error
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const [error, setError] = useState("");
  const history = useHistory();

  //if the form is being used to edit a reservation
  useEffect(() => {
    if (initialFormState) {
      setFormData({ ...initialFormState });
    }
  }, [initialFormState]);

  //helper function validate date
  function validateDate(date) {
    const dateObj = new Date(date);
    console.log(dateObj);
    if (date < today()) {
      setError("Cannot book before today");
    } else if (dateObj.getDay() === 2) {
      setError("Canot book on Tuesdays");
    } else {
      setError(false);
    }
  }

  //helper function validate time
  function validateTime(time) {
    if (!error) {
      if (time < "10:30" || time > "21:30") {
        setError("Reservation must be between 10:30 am and 9:30 pm");
      } else {
        setError(false);
      }
    }
  }

  function validateDateTime(date, time) {
    if (!error) {
      const dateTimeString =
        formData.reservation_date + "T" + formData.reservation_time;
      const dateTimeObj = new Date(dateTimeString);
      const todayObj = new Date();
      console.log("dateTimeObj:", dateTimeObj);
      if (dateTimeObj < todayObj) {
        console.log(error);
      }
    }
  }

  //handle change to form inputs
  async function handleChange({ target }) {
    if (target.name === "reservation_date") {
      validateDate(target.value);
    }

    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  async function handleSubmit(event) {
    validateTime(formData.reservation_time);
    validateDateTime();

    event.preventDefault();

    //if isNew, it is a new form and do this:
    try {
      if (!initialFormState) {
        const newReservation = {
          ...formData,
          people: Number(formData.people),
        };
        await createReservation(newReservation);
      } else {
        const newReservation = {
          ...formData,
          people: Number(formData.people),
          reservation_time: formatAsTime(formData.reservation_time),
        };
        console.log("updating...", newReservation);

        await updateReservation(newReservation, reservation_id, status);
      }

      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.log(error);
      ErrorAlert(error);
    }
  }

  return (
    <main className="helvetica align-content-center">
      <form className="reservation-form col" onSubmit={handleSubmit}>
        <label className="form-components">
          First Name
          <input
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </label>

        <label className="form-components">
          Last Name
          <input
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </label>

        <label className="form-components fs-5">
          Phone Number
          <input
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
        </label>

        <label className="form-components">
          Date
          <input
            name="reservation_date"
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </label>

        <label className="form-components">
          Time
          <input
            name="reservation_time"
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </label>

        <label className="form-components">
          Number of people:
          <input
            name="people"
            type="number"
            min="0"
            onChange={handleChange}
            value={formData.people}
            required
          />
        </label>

        {error ? <div className="alert alert-danger">{error}</div> : <></>}

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
    </main>
  );
}

export default ReservationForm;
