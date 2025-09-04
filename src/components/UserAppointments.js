import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Box, Heading, Text, Badge, Stack } from "@chakra-ui/react";

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDocs(collection(db, "users", uid, "appointments"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(list);
    };
    fetch();
  }, []);

  const statusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "yellow";
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>📅 My Appointments</Heading>
      <Stack spacing={4}>
        {appointments.length === 0 ? (
          <Text>No appointments found.</Text>
        ) : (
          appointments.map(app => (
            <Box key={app.id} p={4} shadow="md" borderWidth="1px" borderRadius="md">
              <Text><strong>To Vendor:</strong> {app.business_name}</Text>
              <Text><strong>Message:</strong> {app.message}</Text>
              <Text><strong>Preferred Date:</strong> {app.preferredDate}</Text>
              <Badge colorScheme={statusColor(app.status)}>{app.status}</Badge>
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default UserAppointments;
