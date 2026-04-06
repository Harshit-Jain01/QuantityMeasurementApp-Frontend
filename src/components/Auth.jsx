import React, { useState } from "react";
import "../styles/auth.css";
import { GoogleLogin } from "@react-oauth/google";

const Auth = () => {

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // =========================
  // NORMAL LOGIN / SIGNUP
  // =========================
  const handleSubmit = async () => {

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    if (isSignup && !name) {
      alert("Enter username");
      return;
    }

    const url = isSignup
      ? "http://localhost:8081/auth/signup"
      : "http://localhost:8081/auth/signin";

    const body = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      // =========================
      // SIGNUP
      // =========================
      if (isSignup) {
        if (!data.token) {
          alert(data.message || "Signup failed");
          return;
        }

        alert("Signup successful! Please login.");

        setIsSignup(false);
        setName("");
        setEmail("");
        setPassword("");
        return;
      }

      // =========================
      // LOGIN
      // =========================
      if (!data.token) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:8081/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      const data = await res.json();

      if (!data.token) {
        alert("Google login failed");
        return;
      }

      //  Save JWT
      localStorage.setItem("token", data.token);

      //  Redirect
      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
      alert("Google login error");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        {/* TABS */}
        <div className="tabs">
          <span
            className={!isSignup ? "active" : ""}
            onClick={() => setIsSignup(false)}
          >
            Login
          </span>

          <span
            className={isSignup ? "active" : ""}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </span>
        </div>

        {/* FORM */}
        <div className="form">

          {isSignup && (
            <input
              placeholder="Username"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {isSignup ? "Signup" : "Login"}
          </button>

          {/* =========================
              GOOGLE BUTTON (BOTH TABS)
          ========================= */}
          <div style={{ marginTop: "10px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
              text={isSignup ? "signup_with" : "signin_with"}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;