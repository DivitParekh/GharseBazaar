import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";

const UploadService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendorId = auth.currentUser?.uid;

    if (!vendorId) {
      setMessage("You must be logged in as a vendor.");
      return;
    }

    try {
      await addDoc(collection(db, "vendors", vendorId, "services"), {
        title,
        description,
        createdAt: serverTimestamp(),
      });
      setMessage("✅ Service added!");
      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Upload a New Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Service Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Service Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">Add Service</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UploadService;
