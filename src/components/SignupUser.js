import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const SignupUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        phone,
        email,
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("User registered successfully!");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>👤 User Signup</h2>
      <form
        onSubmit={handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          padding: "24px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupUser;
