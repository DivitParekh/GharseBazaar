import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const VendorInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      try {
        const inquiriesRef = collection(db, "vendors", user.uid, "inquiries");
        const snapshot = await getDocs(inquiriesRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInquiries(data);
      } catch (err) {
        console.error("❌ Error fetching inquiries:", err);
        setError("Something went wrong while fetching inquiries.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (inquiries.length === 0) return <p>No inquiries received yet.</p>;

  return (
    <div>
      <h2>📥 Your Inquiries</h2>
      <ul>
        {inquiries.map((inq) => (
          <li key={inq.id}>
            <strong>{inq.name}</strong> ({inq.phone})<br />
            <em>{inq.message}</em><br />
            <small>🕒 {inq.createdAt?.toDate?.().toLocaleString?.() || "No timestamp"}</small>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorInquiries;
