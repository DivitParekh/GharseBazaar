import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  const [vendors, setVendors] = useState([]);
  const [userLocation, setUserLocation] = useState([19.0760, 72.8777]); // Default: Mumbai

  useEffect(() => {
    // Get user’s current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    }

    const fetchVendors = async () => {
      const vendorRef = collection(db, "vendors");
      const snapshot = await getDocs(vendorRef);
      const vendorList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((vendor) => vendor.location); // Make sure location exists
      setVendors(vendorList);
    };

    fetchVendors();
  }, []);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <MapContainer center={userLocation} zoom={13} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* User marker */}
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Vendor markers */}
        {vendors.map((vendor) => (
          <Marker
            key={vendor.id}
            position={[vendor.location.lat, vendor.location.lng]}
          >
            <Popup>
              <strong>{vendor.business_name}</strong><br />
              📞 {vendor.phone}<br />
              📦 {vendor.category}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
