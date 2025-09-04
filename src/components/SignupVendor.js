import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const SignupVendor = () => {
  const [form, setForm] = useState({
    business_name: "",
    phone: "",
    email: "",
    password: "",
    category: "",
    area: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.business_name || !form.phone || !form.email || !form.password || !form.category || !form.area) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          await setDoc(doc(db, "vendors", user.uid), {
            uid: user.uid,
            business_name: form.business_name,
            phone: form.phone,
            email: form.email,
            category: form.category,
            area: form.area,
            location,
          });

          alert("✅ Vendor registered successfully with location!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("❌ Failed to get your location.");
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Signup failed.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🧍 Vendor Signup</h2>
      <form
        onSubmit={handleSubmit}
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
        <input type="text" name="business_name" placeholder="Business Name" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category (e.g. Tuition, Tiffin)" onChange={handleChange} required />
        <input type="text" name="area" placeholder="Area / Locality" onChange={handleChange} required />

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

export default SignupVendor;
