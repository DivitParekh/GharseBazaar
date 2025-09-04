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
  Select,
  Spinner,
} from "@chakra-ui/react";
import { db, auth } from "../firebase/config";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  collection,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const BookAppointment = () => {
  const { vendorId } = useParams();
  const [userId, setUserId] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const vendorRef = doc(db, "vendors", vendorId);
        const vendorSnap = await getDoc(vendorRef);
        if (vendorSnap.exists()) {
          setVendor(vendorSnap.data());
        }
      } catch (error) {
        toast({
          title: "Failed to load vendor",
          description: error.message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId, toast]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!form.date) return;
      try {
        const appointmentsRef = collection(db, "vendors", vendorId, "appointments");
        const q = query(appointmentsRef, where("date", "==", form.date));
        const snapshot = await getDocs(q);
        const slots = snapshot.docs
          .filter(doc => doc.data().status !== "rejected")
          .map(doc => doc.data().time);
        setBookedSlots(slots);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [form.date, vendorId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const { name, phone, date, time, notes } = form;

    if (!name || !phone || !date || !time) {
      toast({
        title: "Please fill all required fields",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    try {
      const appointmentsRef = collection(db, "vendors", vendorId, "appointments");
      const q = query(appointmentsRef, where("date", "==", date), where("time", "==", time));
      const snapshot = await getDocs(q);

      const isTaken = snapshot.docs.some(doc => doc.data().status !== "rejected");
      if (isTaken) {
        toast({
          title: "Time slot already booked",
          description: "Please choose another slot.",
          status: "error",
          isClosable: true,
        });
        return;
      }

      // ✅ Vendor-side appointment creation
      const vendorAppointmentRef = await addDoc(appointmentsRef, {
        name,
        phone,
        date,
        time,
        notes,
        userId: userId || "anonymous",
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // ✅ User-side appointment mirror
      if (userId) {
        await setDoc(
          doc(db, "users", userId, "appointments", vendorAppointmentRef.id),
          {
            vendorId,
            name,
            phone,
            date,
            time,
            notes,
            status: "pending",
            createdAt: serverTimestamp(),
          }
        );
      }

      toast({
        title: "✅ Appointment request sent!",
        status: "success",
        isClosable: true,
      });

      setForm({ name: "", phone: "", date: "", time: "", notes: "" });
      setBookedSlots([]);
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error.message.includes("permission")
          ? "Missing or insufficient permissions. Check Firestore rules."
          : error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" mt={20} color="blue.500" />;
  if (!vendor) return <p>Vendor not found</p>;

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
          <FormLabel>Time Slot</FormLabel>
          <Select
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Select available time"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
              </option>
            ))}
          </Select>
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
