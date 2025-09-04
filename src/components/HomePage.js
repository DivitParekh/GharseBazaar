import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const section = {
    padding: "60px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
  };

  const title = {
    fontSize: "36px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  };

  const subtitle = {
    fontSize: "18px",
    color: "#555",
    textAlign: "center",
    marginBottom: "40px",
  };

  const featureBox = {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.08)",
    padding: "30px",
    flex: 1,
    margin: "10px",
    minWidth: "280px",
    textAlign: "center",
  };

  const footerStyle = {
    backgroundColor: "#111",
    color: "#ddd",
    padding: "30px 20px",
    textAlign: "center",
    marginTop: "60px",
  };

  return (
    <>
      {/* Hero Section */}
      <div style={{ ...section, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "30px" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "bold", color: "#222" }}>
            Welcome to GharSeBazaar 🏠
          </h1>
          <p style={{ fontSize: "18px", color: "#444", margin: "20px 0" }}>
            Discover and connect with local services – from tiffin to tuition – trusted and nearby.
          </p>
          <button
            onClick={() => navigate("/vendors")}
            style={{
              padding: "14px 24px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              marginRight: "10px",
            }}
          >
            🔍 Browse Services
          </button>
          <button
            onClick={() => navigate("/signup-vendor")}
            style={{
              padding: "14px 24px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            📤 Join as Vendor
          </button>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2906/2906209.png"
            alt="Local Services"
            style={{ width: "100%", maxWidth: "400px" }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div style={section}>
        <h2 style={title}>✨ Why Use GharSeBazaar?</h2>
        <p style={subtitle}>Empowering local businesses and connecting communities.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={featureBox}>
            <h3>📍 Hyperlocal Discovery</h3>
            <p>Find vendors and services near your home instantly.</p>
          </div>
          <div style={featureBox}>
            <h3>🔒 Safe & Verified</h3>
            <p>All vendors are registered and authenticated with location & phone.</p>
          </div>
          <div style={featureBox}>
            <h3>⚡ Fast Inquiry</h3>
            <p>Send your requirements and get instant response directly from vendors.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ ...section, background: "#f8f9fa", borderRadius: "12px" }}>
        <h2 style={title}>💬 What People Say</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          <div style={{ ...featureBox, background: "#fff" }}>
            <p>“Found a great tutor for my daughter in minutes. This app is a game-changer!”</p>
            <strong>- Neha, Parent</strong>
          </div>
          <div style={{ ...featureBox, background: "#fff" }}>
            <p>“I’m a home tailor and now get regular inquiries without spending on ads.”</p>
            <strong>- Aarti, Vendor</strong>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ ...section, textAlign: "center" }}>
        <h2 style={{ ...title, fontSize: "30px" }}>Start Connecting Today 🚀</h2>
        <p style={subtitle}>Whether you're looking for a service or offering one — GharSeBazaar is your go-to platform.</p>
        <button
          onClick={() => navigate("/signup-user")}
          style={{
            padding: "14px 28px",
            backgroundColor: "#ff5722",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          🚀 Get Started
        </button>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        <p>© {new Date().getFullYear()} GharSeBazaar. All rights reserved.</p>
      </footer>
    </>
  );
};

export default HomePage;
