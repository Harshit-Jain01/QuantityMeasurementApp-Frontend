import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const BASE_URL = "http://localhost:8081";

const Dashboard = () => {

  const [selectedType, setSelectedType] = useState("LengthUnit");
  const [selectedAction, setSelectedAction] = useState("compare");

  const [units, setUnits] = useState([]);
  const [value1, setValue1] = useState(1);
  const [value2, setValue2] = useState(1);
  const [unit1, setUnit1] = useState("");
  const [unit2, setUnit2] = useState("");
  const [operator, setOperator] = useState("add");
  const [result, setResult] = useState("");

  const unitMap = {
    LengthUnit: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
    WeightUnit: ["KILOGRAM", "GRAM", "POUND"],
    TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"],
    VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"]
  };

  //  Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);

  // Update units
  useEffect(() => {
    const list = unitMap[selectedType] ?? [];
    if (list.length < 2) {
      setUnits([]);
      setUnit1("");
      setUnit2("");
      return;
    }
    setUnits(list);
    setUnit1(list[0]);
    setUnit2(list[1]);
  }, [selectedType]);

  //  Calculate
  const calculate = async () => {
    const token = localStorage.getItem("token");
    setResult("");

    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/";
      return;
    }

    let endpoint = "";

    if (selectedAction === "compare") endpoint = "/compare";
    else if (selectedAction === "convert") endpoint = "/convert";
    else {
      if (operator === "add") endpoint = "/add";
      if (operator === "subtract") endpoint = "/subtract";
      if (operator === "divide") endpoint = "/divide";
    }

    if (selectedAction === "arithmetic" && selectedType === "TemperatureUnit") {
      alert("Arithmetic operations are not supported for temperature units.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/qma/api/v1/quantities${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          thisQuantityDTO: {
            value: Number(value1),
            unit: unit1,
            measurementType: selectedType
          },
          thatQuantityDTO: {
            value: selectedAction === "convert" ? 0 : Number(value2),
            unit: unit2,
            measurementType: selectedType
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message = `Request failed with status ${res.status}`;

        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            message =
              errorData.message ||
              errorData.error ||
              message;
          } catch {
            message = errorText;
          }
        }

        throw new Error(message);
      }

      const data = await res.json();

      if (selectedAction === "compare") {
        setResult(data.resultString === "true" ? "Equal" : "Not Equal");
      } else {
        const formattedResult =
          data.resultUnit && data.resultUnit !== "null"
            ? `${data.resultValue} ${data.resultUnit}`
            : `${data.resultValue}`;

        setResult(formattedResult);
      }

    } catch (err) {
      console.error("Calculation failed:", err);
      alert(err.message || "Error while calculating");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">

      {/* Logout */}
      <button className="logout" onClick={logout}>
        Logout
      </button>

      <div className="card">

        <h2>Quantity Converter</h2>

        {/* TYPE */}
        <div className="row">
          {Object.keys(unitMap).map(t => (
            <button
              key={t}
              className={selectedType === t ? "active" : ""}
              onClick={() => setSelectedType(t)}
            >
              {t.replace("Unit", "")}
            </button>
          ))}
        </div>

        {/* ACTION */}
        <div className="row">
          <button
            className={selectedAction === "compare" ? "active" : ""}
            onClick={() => setSelectedAction("compare")}
          >
            Compare
          </button>

          <button
            className={selectedAction === "convert" ? "active" : ""}
            onClick={() => setSelectedAction("convert")}
          >
            Convert
          </button>

          <button
            className={selectedAction === "arithmetic" ? "active" : ""}
            onClick={() => setSelectedAction("arithmetic")}
          >
            Arithmetic
          </button>
        </div>

        {/* INPUTS */}
        <div className="inputs">

          {/* VALUE */}
          <input
            type="number"
            value={value1}
            onChange={e => setValue1(e.target.value)}
          />

          {/* FROM UNIT */}
          <select value={unit1} onChange={e => setUnit1(e.target.value)}>
            {units.map(u => <option key={u}>{u}</option>)}
          </select>

          {/*  CONVERT MODE */}
          {selectedAction === "convert" && (
            <>
              <span>→</span>
              <select value={unit2} onChange={e => setUnit2(e.target.value)}>
                {units.map(u => <option key={u}>{u}</option>)}
              </select>
            </>
          )}

          {/* OTHER MODES */}
          {selectedAction !== "convert" && (
            <>
              <input
                type="number"
                value={value2}
                onChange={e => setValue2(e.target.value)}
              />

              <select value={unit2} onChange={e => setUnit2(e.target.value)}>
                {units.map(u => <option key={u}>{u}</option>)}
              </select>
            </>
          )}

        </div>

        {/* OPERATOR */}
        {selectedAction === "arithmetic" && (
          <div className="row">
            <button
              className={operator === "add" ? "active" : ""}
              onClick={() => setOperator("add")}
            >
              +
            </button>

            <button
              className={operator === "subtract" ? "active" : ""}
              onClick={() => setOperator("subtract")}
            >
              -
            </button>

            <button
              className={operator === "divide" ? "active" : ""}
              onClick={() => setOperator("divide")}
            >
              /
            </button>
          </div>
        )}

        {/* CALCULATE */}
        <button className="main-btn" onClick={calculate}>
          Calculate
        </button>

        {/* RESULT */}
        {result && <h3>{result}</h3>}

      </div>
    </div>
  );
};

export default Dashboard;
