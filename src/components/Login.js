import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      <form onSubmit={handleLogin} style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        backgroundColor: "#fff",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <label style={{ fontWeight: 500 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px"
          }}
        />

        <label style={{ fontWeight: 500 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px"
          }}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
