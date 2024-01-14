import React, { useCallback, useState } from "react";
import { Box, Image, Text, VStack, Button } from "@chakra-ui/react";

const AnimeDetails = ({ animeDetail }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);

  const handleToggleSummary = useCallback(() => {
    setShowFullSummary(!showFullSummary);
  }, []);

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" width="60%">
      <VStack align="center" spacing={4}>
        <Image
          src={animeDetail?.imageSrc}
          alt={animeDetail?.animeTitle}
          height={"50%"}
          // boxSize="200px" // Adjust the boxSize as needed
          objectFit="cover"
          borderRadius="md"
        />
        <Text fontSize="md" fontWeight="bold" wordBreak="break-word">
          {animeDetail?.animeTitle}
        </Text>
        <Text fontSize="sm" fontStyle="italic" wordBreak="break-word">
          Other Name: {animeDetail?.otherName}
        </Text>
        <Text fontSize="sm">Released Date: {animeDetail?.releasedDate}</Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Plot Summary:
        </Text>
        <Text
          fontSize="xs"
          noOfLines={showFullSummary ? 0 : 3}
          wordBreak="break-word"
        >
          {animeDetail?.plotSummary}
        </Text>
        {animeDetail?.plotSummary?.length > 150 && (
          <Button onClick={handleToggleSummary} colorScheme="teal" size="sm">
            {showFullSummary ? "See Less" : "See More"}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default AnimeDetails;
