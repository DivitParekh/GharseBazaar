import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();
  const toast = useToast();

  const [serviceCount, setServiceCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (role === "vendor" && uid) {
        try {
          const servicesSnap = await getDocs(collection(db, "vendors", uid, "services"));
          setServiceCount(servicesSnap.size);

          const inquiriesSnap = await getDocs(collection(db, "vendors", uid, "inquiries"));
          setInquiryCount(inquiriesSnap.size);
        } catch (err) {
          console.error("Error fetching vendor dashboard data:", err);
        }
      }
    };

    fetchVendorData();
  }, [role, uid]);

  const handleVendorPanel = () => {
    navigate("/vendor-dashboard"); // 👈 update this route as per your actual vendor dashboard path
  };

  const handleBrowseVendors = () => {
    navigate("/vendors"); // 👈 update this route as per your actual vendor listing path
  };

  return (
    <Box py={10} px={4} maxW="800px" mx="auto">
      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading fontSize="2xl" mb={2}>
          👋 Welcome, {name || "User"}!
        </Heading>
        <Text mb={2}>
          You are logged in as: <strong>{role}</strong>
        </Text>

        {role === "vendor" ? (
          <>
            <Text mb={4}>
              Manage your profile, services, and view customer inquiries here.
            </Text>
            <Button
              colorScheme="teal"
              leftIcon={<span>📂</span>}
              onClick={handleVendorPanel}
            >
              Go to Vendor Panel
            </Button>

            <Divider my={6} />

            <Text fontWeight="semibold" fontSize="lg" mb={3}>
              📊 Dashboard Summary
            </Text>
            <HStack spacing={6}>
              <Box
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="center"
                flex="1"
              >
                <Text fontSize="xl" fontWeight="bold">
                  {serviceCount}
                </Text>
                <Text fontSize="sm">Services Listed</Text>
              </Box>
              <Box
                p={4}
                bg="gray.100"
                borderRadius="md"
                textAlign="center"
                flex="1"
              >
                <Text fontSize="xl" fontWeight="bold">
                  {inquiryCount}
                </Text>
                <Text fontSize="sm">Total Inquiries</Text>
              </Box>
            </HStack>
          </>
        ) : (
          <>
            <Text mt={4}>
              You can now browse local services, submit inquiries, and suggest vendors.
            </Text>
            <Button
              mt={4}
              colorScheme="blue"
              leftIcon={<span>🔍</span>}
              onClick={handleBrowseVendors}
            >
              Browse Vendors
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
