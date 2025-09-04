import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";

import SignupUser from "./components/SignupUser";
import SignupVendor from "./components/SignupVendor";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import VendorList from "./components/VendorList";
import UploadService from "./components/UploadService";
import VendorProfile from "./components/VendorProfile";
import VendorDashboard from "./components/VendorDashboard";
import VendorInquiries from "./components/VendorInquiries";
import MapView from "./components/MapView";
import NearbyVendors from "./components/NearbyVendors";
import HomePage from "./components/HomePage";
import BookAppointment from "./components/BookAppointment";
import VendorAppointments from "./components/VendorAppointments";
import UserAppointments from "./components/UserAppointments";



const App = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !role) {
        const uid = user.uid;

        const userRef = doc(db, "users", uid);
        const vendorRef = doc(db, "vendors", uid);

        const [userSnap, vendorSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(vendorRef),
        ]);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("role", "user");
          localStorage.setItem("name", userData.name);
          navigate("/dashboard");
        } else if (vendorSnap.exists()) {
          const vendorData = vendorSnap.data();
          localStorage.setItem("role", "vendor");
          localStorage.setItem("name", vendorData.business_name);
          navigate("/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, role]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {/* 🔷 NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", gap: "24px", fontWeight: 500 }}>
          {!role && (
            <>
              <Link to="/">Home</Link>
              <Link to="/signup-user">User Signup</Link>
              <Link to="/signup-vendor">Vendor Signup</Link>
              <Link to="/login">Login</Link>
              

            </>
          )}

          {role === "user" && (
            <>
              <Link to="/vendors">Browse Vendors</Link>
              <Link to="/map">Map View</Link>
              <Link to="/nearby">Nearby Vendors</Link>
              <Link to="/my-appointments">My Appointments</Link>

              
            </>
          )}

          {role === "vendor" && (
            <>
              <Link to="/upload-service">Upload Service</Link>
              <Link to="/vendor-dashboard">Vendor Dashboard</Link>
              <Link to="/vendor/inquiries">Inquiries</Link>
              <Link to="/vendor/appointments">Appointments</Link>

            </>
          )}

          {role && <Link to="/dashboard">Dashboard</Link>}
        </div>

        {role && (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </nav>

      {/* 🔷 MAIN CONTAINER */}
      <main style={{
        padding: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "start"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "900px",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.07)"
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup-user" element={<SignupUser />} />
            <Route path="/signup-vendor" element={<SignupVendor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/upload-service" element={<UploadService />} />
            <Route path="/vendor/:id" element={<VendorProfile />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/inquiries" element={<VendorInquiries />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/nearby" element={<NearbyVendors />} />
            <Route path="/book-appointment/:vendorId" element={<BookAppointment />} />
            <Route path="/vendor/appointments" element={<VendorAppointments />} />
            <Route path="/my-appointments" element={<UserAppointments />} />
          </Routes>


        </div>
      </main>
    </div>
  );
};

export default App;
