import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { db, auth } from "../firebase/config";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BookAppointment = () => {
  const { vendorId } = useParams();
  const [userId, setUserId] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  const toast = useToast();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
  }, []);

  useEffect(() => {
    const fetchVendor = async () => {
      const vendorRef = doc(db, "vendors", vendorId);
      const vendorSnap = await getDoc(vendorRef);
      if (vendorSnap.exists()) {
        setVendor(vendorSnap.data());
      }
    };
    fetchVendor();
  }, [vendorId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast({
        title: "Please fill all required fields",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(db, "vendors", vendorId, "appointments"), {
        ...form,
        userId,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Appointment requested successfully!",
        status: "success",
        isClosable: true,
      });
      setForm({ name: "", phone: "", date: "", time: "", notes: "" });
    } catch (error) {
      toast({
        title: "Failed to book appointment",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (!vendor) return <p>Loading vendor details...</p>;

  return (
    <Box maxW="500px" mx="auto" mt="40px" p={6} boxShadow="lg" borderRadius="md">
      <Heading mb={4}>Book Appointment with {vendor.business_name}</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date</FormLabel>
          <Input type="date" name="date" value={form.date} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Time</FormLabel>
          <Input type="time" name="time" value={form.time} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Additional Notes</FormLabel>
          <Textarea name="notes" value={form.notes} onChange={handleChange} />
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit} width="100%">
          📅 Book Appointment
        </Button>
      </VStack>
    </Box>
  );
};

export default BookAppointment;
