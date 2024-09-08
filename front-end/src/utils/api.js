/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[table]>}
 */

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Retrieves the reservation with a matching id.
 * @returns {Promise<{reservation}>}
 */

export async function getReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/seat`);
  return await fetchJson(url, { signal }, []);
}

export async function getReservationByMobileNum(mobileNum, signal) {
  const url = new URL(
    `${API_BASE_URL}/reservations?mobile_number=${mobileNum}`
  );
  console.log("inside api");
  return await fetchJson(url, { signal });
}

/**
 * Creates a new reservation.
 */

export async function createReservation(newReservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: newReservation }),
    signal,
  };
  return await fetchJson(url, options, newReservation);
}

/**
 * Create a new table.
 */

export async function createTable(newTable, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: newTable }),
    signal,
  };
  return await fetchJson(url, options, newTable);
}

/**
 * Set the table reservation id
 * @param {table_id, reservation_id} params
 * @param {*} signal
 */
export async function setTableReservation(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Update the reservation from edit
 */
export async function updateReservation(
  newReservation,
  reservation_id,
  status,
  signal
) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: {...newReservation, status: status} }),
    signal,
  };
  return await fetchJson(url, options);
}

/**
 * Delete a reservation from a table
 * @param {*} table_id
 * @param {*} reservation_id
 * @param {*} signal
 * @returns
 */

export async function deleteTableReservation(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options);
}


/**
 * Update a reservation to have a status of cancelled
 */
export async function setReservationCancel(reservation_id, signal){
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options ={
    method: "PUT",
    headers,
    body: JSON.stringify({data: {status: "cancelled"} }),
    signal,
  };
  return await fetchJson(url, options);
}