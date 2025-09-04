import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const InquiryForm = () => {
  const { id: vendorId } = useParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
    preferredTime: "",
    serviceInterest: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "vendors", vendorId, "inquiries"), form);
      alert("✅ Inquiry submitted!");
      setForm({
        name: "",
        phone: "",
        message: "",
        preferredTime: "",
        serviceInterest: "",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("❌ Failed to submit inquiry.");
    }
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "12px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    padding: "10px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  const containerStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    margin: "0 auto",
    marginTop: "20px"
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h3>📩 Send Inquiry</h3>
      <input style={inputStyle} type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
      <input style={inputStyle} type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
      <input style={inputStyle} type="text" name="serviceInterest" placeholder="Service Interested In (optional)" value={form.serviceInterest} onChange={handleChange} />
      <input style={inputStyle} type="text" name="preferredTime" placeholder="Preferred Time (optional)" value={form.preferredTime} onChange={handleChange} />
      <textarea style={{ ...inputStyle, height: "100px" }} name="message" placeholder="Message" value={form.message} onChange={handleChange} required></textarea>
      <button style={buttonStyle} type="submit">Submit Inquiry</button>
    </form>
  );
};

export default InquiryForm;
