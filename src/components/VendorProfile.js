import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import InquiryForm from "./InquiryForm";
import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  Input,
  Textarea,
  Button,
  VStack,
} from "@chakra-ui/react";

const VendorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 Navigation hook
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", comment: "", rating: 5 });

  useEffect(() => {
    const fetchVendorProfile = async () => {
      const vendorRef = doc(db, "vendors", id);
      const vendorSnap = await getDoc(vendorRef);

      if (vendorSnap.exists()) {
        setVendor(vendorSnap.data());
      }

      const servicesRef = collection(db, "vendors", id, "services");
      const servicesSnap = await getDocs(servicesRef);
      const serviceList = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(serviceList);

      const reviewsRef = collection(db, "vendors", id, "reviews");
      const reviewSnap = await getDocs(reviewsRef);
      const reviewList = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewList);
    };

    fetchVendorProfile();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!newReview.name || !newReview.comment) return alert("Fill in all review fields.");
    try {
      await addDoc(collection(db, "vendors", id, "reviews"), {
        ...newReview,
        createdAt: serverTimestamp(),
      });
      setNewReview({ name: "", comment: "", rating: 5 });
      alert("✅ Review submitted!");
      const reviewSnap = await getDocs(collection(db, "vendors", id, "reviews"));
      setReviews(reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (!vendor) return <Text>Loading vendor profile...</Text>;

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Heading mb={2}>{vendor.business_name}</Heading>
      <Text>📍 Area: {vendor.area}</Text>
      <Text>📦 Category: {vendor.category}</Text>
      <Text>📞 Phone: {vendor.phone}</Text>
      <Text>📧 Email: {vendor.email}</Text>

      <Divider my={6} />

      <Heading size="md" mb={2}>🛠 Services Offered</Heading>
      {services.length === 0 ? (
        <Text>No services uploaded yet.</Text>
      ) : (
        <VStack align="start" spacing={3} mt={2}>
          {services.map(service => (
            <Box key={service.id} p={4} border="1px solid #e2e8f0" borderRadius="md" w="100%">
              <Text fontWeight="bold">{service.title}</Text>
              <Text>{service.description}</Text>
            </Box>
          ))}
        </VStack>
      )}

      <Divider my={6} />

      {/* ✨ Ratings & Reviews */}
      <Heading size="md" mb={4}>⭐ Ratings & Reviews</Heading>
      <VStack align="start" spacing={3}>
        {reviews.length === 0 ? (
          <Text>No reviews yet.</Text>
        ) : (
          reviews.map((review) => (
            <Box key={review.id} p={4} bg="gray.50" borderRadius="md" w="100%">
              <Text fontWeight="bold">{review.name} ({review.rating} ⭐)</Text>
              <Text mt={1}>{review.comment}</Text>
            </Box>
          ))
        )}
      </VStack>

      <Box mt={6}>
        <Heading size="sm" mb={2}>Leave a Review</Heading>
        <Input
          placeholder="Your Name"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          mb={2}
        />
        <Input
          type="number"
          max={5}
          min={1}
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          mb={2}
        />
        <Textarea
          placeholder="Your Comment"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          mb={2}
        />
        <Button colorScheme="teal" onClick={handleReviewSubmit}>
          Submit Review
        </Button>
      </Box>

      <Divider my={6} />

      {/* 📩 Inquiry Form */}
      <InquiryForm vendorId={id} />

      <Box mt={6} textAlign="center">
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => navigate(`/book-appointment/${id}`)}
        >
          📅 Book Appointment
        </Button>
      </Box>
    </Box>
  );
};

export default VendorProfile;
