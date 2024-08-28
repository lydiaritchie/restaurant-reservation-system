import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

/**
 * Page to create a new table.
 */
function NewTable() {
  const history = useHistory();

  const initalFormState = {
    table_name: "",
    capacity: 1,
  }

  const [formData, setFormData] = useState({...initalFormState});

  //handle change to form inputs
  async function handleChange({target}){
    setFormData({
        ...formData,
        [target.name]: target.value,
    })
  }

  async function handleSubmit(event){
    event.preventDefault();

    const newTable = {
      table_name: formData.table_name,
      capacity: Number(formData.capacity),
    };
    console.log(newTable);
    try{
        //saves the table to the database 
        await createTable(newTable);
        history.push(`/dashboard`);
    } catch(error) {
        console.log(error);
        ErrorAlert(error);
    }
  }

  return (
    <main>
      <h3 className="date-title m-3">Create Table</h3>
      <form className="col" onSubmit={handleSubmit}>

        <label className="form-components">
          Table Name
          <input 
          name="table_name" 
          value={formData.table_name}
          onChange={handleChange}
          minLength="2"
          required
          />
        </label>
        <label className="form-components">
          Capacity
          <input 
          name="capacity" 
          min="1" 
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          required
          />
        </label>

        <div className="buttons d-flex mt-3 justify-content-between">
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

export default NewTable;
