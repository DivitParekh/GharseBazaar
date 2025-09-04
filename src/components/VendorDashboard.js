import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const VendorDashboard = () => {
  const [vendorId, setVendorId] = useState(null);
  const [vendorInfo, setVendorInfo] = useState({});
  const [inquiries, setInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setVendorId(user.uid);
      } else {
        setVendorId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!vendorId) return;

    const fetchData = async () => {
      try {
        const vendorDoc = await getDoc(doc(db, "vendors", vendorId));
        setVendorInfo(vendorDoc.data());

        const servicesSnap = await getDocs(
          collection(db, "vendors", vendorId, "services")
        );
        setServices(servicesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const inquirySnap = await getDocs(
          collection(db, "vendors", vendorId, "inquiries")
        );
        setInquiries(inquirySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const handleVendorInfoSave = async () => {
    try {
      await updateDoc(doc(db, "vendors", vendorId), vendorInfo);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleAddService = async () => {
    if (!newService.title || !newService.description)
      return alert("Fill both fields");

    try {
      await addDoc(collection(db, "vendors", vendorId, "services"), newService);
      setNewService({ title: "", description: "" });
      alert("✅ Service added!");

      const servicesSnap = await getDocs(
        collection(db, "vendors", vendorId, "services")
      );
      setServices(servicesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "vendors", vendorId, "services", serviceId));
      setServices(services.filter((service) => service.id !== serviceId));
      alert("🗑 Service deleted.");
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;
  if (!vendorId)
    return (
      <p style={{ textAlign: "center" }}>
        🚫 Please log in as a vendor to view your dashboard.
      </p>
    );

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "12px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        📋 Vendor Dashboard
      </h2>

      {/* 👤 Vendor Info */}
      <div style={cardStyle}>
        <h3>👤 Your Profile</h3>
        <input
          style={inputStyle}
          type="text"
          placeholder="Business Name"
          value={vendorInfo.business_name || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, business_name: e.target.value })
          }
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Category"
          value={vendorInfo.category || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, category: e.target.value })
          }
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Area"
          value={vendorInfo.area || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, area: e.target.value })
          }
        />
        <input
          style={inputStyle}
          type="text"
          placeholder="Phone"
          value={vendorInfo.phone || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, phone: e.target.value })
          }
        />
        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={vendorInfo.email || ""}
          onChange={(e) =>
            setVendorInfo({ ...vendorInfo, email: e.target.value })
          }
        />
        <button style={buttonStyle} onClick={handleVendorInfoSave}>
          💾 Save Profile
        </button>
      </div>

      {/* ➕ Add Service */}
      <div style={cardStyle}>
        <h3>➕ Add a New Service</h3>
        <input
          style={inputStyle}
          type="text"
          placeholder="Service Title"
          value={newService.title}
          onChange={(e) =>
            setNewService({ ...newService, title: e.target.value })
          }
        />
        <textarea
          style={{ ...inputStyle, height: "100px" }}
          placeholder="Service Description"
          value={newService.description}
          onChange={(e) =>
            setNewService({ ...newService, description: e.target.value })
          }
        ></textarea>
        <button style={buttonStyle} onClick={handleAddService}>
          ➕ Add Service
        </button>
      </div>

      {/* 📦 List Services */}
      <div style={cardStyle}>
        <h3>📦 Your Services</h3>
        {services.length === 0 ? (
          <p>No services yet.</p>
        ) : (
          services.map((service) => (
            <div key={service.id} style={{ marginBottom: "15px" }}>
              <strong>{service.title}</strong>
              <p>{service.description}</p>
              <button
                onClick={() => handleDeleteService(service.id)}
                style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
              >
                🗑 Delete
              </button>
              <hr />
            </div>
          ))
        )}
      </div>

      {/* 💬 Inquiries */}
      <div style={cardStyle}>
        <h3>📥 User Inquiries</h3>
        {inquiries.length === 0 ? (
          <p>No inquiries received yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <div style={{ marginBottom: "4px" }}>
                  <strong>{inq.name}</strong> &nbsp;
                  <span style={{ color: "#555" }}>📞 {inq.phone}</span>
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  💬 {inq.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
