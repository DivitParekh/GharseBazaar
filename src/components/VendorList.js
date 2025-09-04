import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import {
  Box,
  Text,
  Badge,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { StarIcon, PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { FaUtensils, FaBook, FaCut, FaLaptop, FaCoffee, FaClinicMedical } from "react-icons/fa";

const categoryIcons = {
  Tiffin: FaUtensils,
  Tuition: FaBook,
  Tailor: FaCut,
  Freelancer: FaLaptop,
  Cafe: FaCoffee,
  Clinic: FaClinicMedical,
};

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vendors"));
        const vendorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendors(vendorData);
        setFilteredVendors(vendorData);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  const applyFilters = () => {
    const filtered = vendors.filter((vendor) => {
      const categoryMatch = categoryFilter
        ? vendor.category?.trim().toLowerCase() === categoryFilter.toLowerCase()
        : true;

      const areaMatch = areaFilter
        ? vendor.area?.trim().toLowerCase().includes(areaFilter.toLowerCase())
        : true;

      return categoryMatch && areaMatch;
    });

    setFilteredVendors(filtered);
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Nearby Vendors</Heading>

      {/* Filters */}
      <HStack spacing={4} mb={6}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tiffin">Tiffin</option>
          <option value="Tuition">Tuition</option>
          <option value="Tailor">Tailor</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Cafe">Cafe</option>
          <option value="Clinic">Clinic</option>
        </select>
        <input
          type="text"
          placeholder="Search Area (e.g. Andheri)"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        />
        <Button colorScheme="teal" onClick={applyFilters}>Apply Filters</Button>
      </HStack>

      {/* Vendor Cards Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {filteredVendors.map((vendor) => (
          <GridItem key={vendor.id}>
            <Box borderWidth="1px" borderRadius="md" p={4} bg="white" boxShadow="md">
              <HStack justifyContent="space-between">
                <Heading size="md">{vendor.business_name}</Heading>
                <Badge colorScheme="yellow">
                  <StarIcon mr={1} /> {vendor.rating || "4.5"}
                </Badge>
              </HStack>

              <Badge mt={2} colorScheme="purple">
                <HStack spacing={1}>
                  {categoryIcons[vendor.category] && (
                    <Icon as={categoryIcons[vendor.category]} />
                  )}
                  <Text fontSize="xs" fontWeight="bold">
                    {vendor.category?.toUpperCase()}
                  </Text>
                </HStack>
              </Badge>

              <VStack align="start" mt={3} spacing={1}>
                <Text><strong>Area:</strong> {vendor.area || "N/A"}</Text>
                <Text><PhoneIcon mr={2} /> {vendor.phone}</Text>
                <Text><EmailIcon mr={2} /> {vendor.email}</Text>
              </VStack>

              <HStack spacing={3} mt={4}>
                <Link to={`/vendor/${vendor.id}`} style={{ width: "100%" }}>
                  <Button colorScheme="blue" size="sm" w="100%">
                    🔍 View Profile
                  </Button>
                </Link>
                <Link to={`/book-appointment/${vendor.id}`} style={{ width: "100%" }}>
                  <Button colorScheme="green" size="sm" w="100%">
                    📅 Book Appointment
                  </Button>
                </Link>
              </HStack>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default VendorList;
