import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Badge,
  useToast,
} from "@chakra-ui/react";

const VendorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setVendorId(user.uid);
    });
  }, []);

  const fetchAppointments = async () => {
    if (!vendorId) return;
    const snapshot = await getDocs(collection(db, "vendors", vendorId, "appointments"));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(list);
  };

  useEffect(() => {
    fetchAppointments();
  }, [vendorId]);

  const handleStatusChange = async (id, newStatus, userId) => {
    try {
      const vendorRef = doc(db, "vendors", vendorId, "appointments", id);
      const userRef = doc(db, "users", userId, "appointments", id);

      await Promise.all([
        updateDoc(vendorRef, { status: newStatus }),
        updateDoc(userRef, { status: newStatus }),
      ]);

      setAppointments(prev =>
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );

      toast({
        title: `Appointment ${newStatus}`,
        description: `Appointment has been ${newStatus} successfully.`,
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        title: "Error updating appointment status",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>📅 Manage Appointments</Heading>
      <Stack spacing={4}>
        {appointments.length === 0 ? (
          <Text>No appointments received yet.</Text>
        ) : (
          appointments.map(app => (
            <Box
              key={app.id}
              p={4}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              bg="white"
            >
              <Text><strong>Name:</strong> {app.name}</Text>
              <Text><strong>Phone:</strong> {app.phone}</Text>
              <Text><strong>Date:</strong> {app.date}</Text>
              <Text><strong>Time:</strong> {app.time}</Text>
              {app.notes && <Text><strong>Notes:</strong> {app.notes}</Text>}
              <Badge
                mt={2}
                colorScheme={
                  app.status === "approved"
                    ? "green"
                    : app.status === "rejected"
                    ? "red"
                    : "yellow"
                }
              >
                {app.status.toUpperCase()}
              </Badge>

              <Stack mt={3} direction="row">
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => handleStatusChange(app.id, "approved", app.userId)}
                  isDisabled={app.status === "approved"}
                >
                  ✅ Approve
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleStatusChange(app.id, "rejected", app.userId)}
                  isDisabled={app.status === "rejected"}
                >
                  ❌ Reject
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default VendorAppointments;
