import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCustomer } from "./customerSlice";
import styles from "./customer.module.css";

function Customer() {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const dispatch = useDispatch();

  function handleClick() {
    if (!fullName || !nationalId) return;
    dispatch(createCustomer(fullName, nationalId));
    setFullName("");
    setNationalId("");
  }

  return (
    <div className={styles.container}>
      <h2>Create new customer</h2>
      <div className={styles.inputs}>
        <div>
          <label>Customer full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
          />
        </div>
        <div>
          <label>National ID</label>
          <input
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            type="text"
          />
        </div>
        <button onClick={handleClick}>Create new customer</button>
      </div>
    </div>
  );
}

export default Customer;
