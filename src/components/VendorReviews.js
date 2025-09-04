// src/components/VendorReviews.js
import React, { useState } from "react";
import {
  Box,
  Text,
  Textarea,
  Button,
  Input,
  VStack,
  HStack,
  Icon,
  useToast
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

const VendorReviews = ({ vendorId, onSubmitReview, reviews }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      toast({
        title: "Rating and comment required",
        status: "warning",
        isClosable: true,
      });
      return;
    }
    onSubmitReview({ rating, comment });
    setRating(0);
    setComment("");
    toast({
      title: "Review submitted!",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <Box mt={10} bg="gray.50" p={5} borderRadius="md" boxShadow="sm">
      <Text fontSize="xl" fontWeight="bold" mb={4}>⭐ Leave a Review</Text>
      <HStack spacing={1} mb={3}>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <Icon
              key={index}
              as={FaStar}
              boxSize={6}
              color={starValue <= (hover || rating) ? "yellow.400" : "gray.300"}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              cursor="pointer"
            />
          );
        })}
      </HStack>
      <Textarea
        placeholder="Write your feedback here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        mb={3}
      />
      <Button colorScheme="blue" onClick={handleSubmit}>Submit</Button>

      {/* Reviews List */}
      <Box mt={10}>
        <Text fontSize="lg" fontWeight="semibold" mb={3}>📝 User Reviews</Text>
        <VStack spacing={4} align="stretch">
          {reviews?.length === 0 && <Text>No reviews yet.</Text>}
          {reviews.map((rev, idx) => (
            <Box key={idx} p={4} bg="white" border="1px" borderColor="gray.200" borderRadius="md">
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={FaStar}
                    boxSize={4}
                    color={i < rev.rating ? "yellow.400" : "gray.300"}
                  />
                ))}
              </HStack>
              <Text mt={2}>{rev.comment}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default VendorReviews;
