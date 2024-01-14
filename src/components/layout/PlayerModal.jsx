// FullScreenModal.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  IconButton,
  useDisclosure,
  VStack,
  Box,
  Link,
  HStack,
  Flex,
} from "@chakra-ui/react";
import VideoPlayer from "../video/videoPlayer";
import { fetchData } from "../../services/api";
import { useQuery, QueryCache } from "@tanstack/react-query";
import Select from "react-dropdown-select";
import { processAnimeName, processEpisodeList } from "../helpers/DataProcessor";
import AnimeDetails from "./AnimeDetail";
import { IoMdArrowRoundBack } from "react-icons/io";

const PlayerModal = ({
  videoUrl,
  onClose,
  changeVideoUrl,
  currentStreamingAnime = null,
}) => {
  const queryCache = new QueryCache({});
  const [currentEpisode, setCurrentEpisode] = useState([]);
  const [currentAnime, setCurrentAnime] = useState(currentStreamingAnime ?? "");
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await fetchData(`/watch${videoUrl}`);
    },
    queryKey: [`${videoUrl}`],
    staleTime: 1200000,
    enabled: !!videoUrl,
  });

  const vidSrc = useMemo(() => {
    if (Array.isArray(data?.data?.source)) {
      return data?.data?.source[0]?.file;
    }
  }, [data]);

  const episodes = useMemo(() => {
    return data?.data?.epList?.nonActiveEpisodes || [];
  }, [data]);

  const episodesOptions = useMemo(() => {
    return processEpisodeList(episodes, videoUrl) || [];
  }, [episodes, videoUrl]);

  const onEpisodeChange = useCallback((val) => {
    if (val) {
      console.log("VALlll::", val);
      setCurrentEpisode(val);
      changeVideoUrl(val[0].value);
    }
  }, []);

  useEffect(() => {
    if (episodesOptions && episodesOptions?.length > 0) {
      setCurrentEpisode([episodesOptions?.find((el) => el.value === videoUrl)]);
    }
  }, [episodesOptions, videoUrl]);

  useEffect(() => {
    if (data?.data?.animeInfo) {
      setCurrentAnime(data?.data?.animeInfo);
    }
  }, [data?.data?.animeInfo]);

  const {
    data: animeDetail,
    isLoading: isFetchingAnime,
    isFetching: fetchingAnime,
  } = useQuery({
    enabled: !!currentAnime,
    queryFn: async () => {
      return await fetchData(
        `/details/${currentAnime}?extractEpisode=${!!currentStreamingAnime}`
      );
    },
    queryKey: [`detail`, currentAnime],
    staleTime: 1200000,
  });

  return (
    <Modal isOpen={true} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxH="80vh" overflow={"hidden"}>
        <ModalHeader>
          <IconButton icon={<IoMdArrowRoundBack />} onClick={onClose} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow={"auto"}>
          <Flex gap={4}>
            <Box flex="1" height={"100%"}>
              {vidSrc && <VideoPlayer url={vidSrc} />}
              <HStack spacing={4} mt={4}>
                <Box fontWeight="bold">Episodes:</Box>
                <Select
                  values={currentEpisode}
                  onChange={(val) => onEpisodeChange(val)}
                  options={episodesOptions}
                  loading={episodesOptions?.length === 0}
                  dropdownPosition={"auto"}
                  style={{
                    color: "black",
                    backgroundColor: "inherit",
                    minWidth: "100px",
                  }}
                />
              </HStack>
            </Box>
            {!!currentAnime && (
              <Box flex="1">
                <AnimeDetails animeDetail={animeDetail?.data?.animeInfo} />
              </Box>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PlayerModal;
