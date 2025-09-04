import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { getDistance } from "geolib";

const NearbyVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // 1. Get user location
        navigator.geolocation.getCurrentPosition(async (position) => {
          const userLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(userLoc);

          // 2. Fetch all vendors
          const snapshot = await getDocs(collection(db, "vendors"));
          const allVendors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // 3. Filter nearby vendors (within 3km)
          const nearby = allVendors.filter((vendor) => {
            if (!vendor.location) return false;
            const distance = getDistance(userLoc, {
              latitude: vendor.location.lat,
              longitude: vendor.location.lng,
            });
            return distance <= 3000; // meters
          });

          setVendors(nearby);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching vendors or location", error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) return <p>📍 Getting your location and loading nearby vendors...</p>;
  if (vendors.length === 0) return <p>😕 No vendors found near your location.</p>;

  return (
    <div>
      <h2>🧭 Vendors Near You</h2>
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <strong>{vendor.business_name}</strong><br />
            📞 {vendor.phone} | 📍 {vendor.area} | {vendor.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyVendors;
