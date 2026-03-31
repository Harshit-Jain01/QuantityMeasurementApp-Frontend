let selectedType = "LengthUnit";
let selectedAction = "arithmetic";

const units = {
    LengthUnit: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
    WeightUnit: ["KILOGRAM", "GRAM", "POUND"],
    TemperatureUnit: ["CELSIUS", "FAHRENHEIT", "KELVIN"],
    VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"]
};

window.onload = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "../html/auth.html";
        return;
    }

    populateUnits();
};

// ================= TYPE =================
function setType(type, el) {
    selectedType = type;
    document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
    populateUnits();
}

// ================= ACTION =================
function setAction(action, el) {
    selectedAction = action;
    document.querySelectorAll(".action-btn").forEach(b => b.classList.remove("active"));
    el.classList.add("active");
    updateOperatorUI();
}

// ================= UI =================
function updateOperatorUI() {
    const op = document.getElementById("operator");
    const arrow = document.getElementById("arrow");

    if (selectedAction === "arithmetic") {
        op.style.display = "block";
        arrow.style.display = "none";
    } else if (selectedAction === "convert") {
        op.style.display = "none";
        arrow.style.display = "block";
    } else {
        op.style.display = "none";
        arrow.style.display = "none";
    }
}

// ================= DROPDOWN =================
function populateUnits() {
    const list = units[selectedType];
    unit1.innerHTML = "";
    unit2.innerHTML = "";

    list.forEach(u => {
        unit1.innerHTML += `<option value="${u}">${u}</option>`;
        unit2.innerHTML += `<option value="${u}">${u}</option>`;
    });
}

// ================= CALCULATE =================
async function calculate() {
    const token = localStorage.getItem("token");

    const v1 = parseFloat(value1.value);
    const v2 = parseFloat(value2.value);
    const u1 = unit1.value;
    const u2 = unit2.value;

    let url = "";

    if (selectedAction === "compare") {
        url = "http://localhost:8081/api/v1/quantities/compare";
    } else if (selectedAction === "convert") {
        url = "http://localhost:8081/api/v1/quantities/convert";
    } else {
        const op = operator.value;
        if (op === "add") url = "http://localhost:8081/api/v1/quantities/add";
        if (op === "subtract") url = "http://localhost:8081/api/v1/quantities/subtract";
        if (op === "divide") url = "http://localhost:8081/api/v1/quantities/divide";
    }

    const body = {
        thisQuantityDTO: {
            value: v1,
            unit: u1,
            measurementType: selectedType
        },
        thatQuantityDTO: {
            value: v2 || 0,
            unit: u2,
            measurementType: selectedType
        }
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        let result = "";

        if (selectedAction === "compare") {
            result = data.resultString === "true" ? "Equal" : "Not Equal";
        } else {
            result = data.resultValue + " " + data.resultUnit;
        }

        document.getElementById("result-box").style.display = "block";
        document.getElementById("result-text").innerText = result;

    } catch (err) {
        console.error(err);
        alert("Error connecting to backend");
    }
}

// ================= LOGOUT =================
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    window.location.href = "../html/auth.html";
}