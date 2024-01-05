// FullScreenModal.js
import React, { useEffect, useMemo } from 'react';
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
} from '@chakra-ui/react';
import VideoPlayer from '../video/videoPlayer';
import { fetchData } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-dropdown-select';
import { processAnimeName, processEpisodeList } from '../helpers/DataProcessor';
import AnimeDetails from './AnimeDetail';

const PlayerModal = ({ videoUrl, onClose }) => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await fetchData(`/watch${videoUrl}`);
    },
    queryKey: [`${videoUrl}`],
    staleTime: 1200000,
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
  }, [episodes]);

  const onEpisodeChange = (val) => {
    console.log('CCC:::', val);
  };

  const currentAnime = useMemo(() => {
    if (data?.data?.animeInfo) {
      return data?.data?.animeInfo;
    } else return null;
  }, [data]);

  const { data: animeDetail } = useQuery({
    queryFn: async () => {
      return await fetchData(`/details/${currentAnime}`);
    },
    queryKey: [`detail`, currentAnime],
    enabled: !!currentAnime,
    staleTime: 1200000,
  });

  return (
    <Modal isOpen={true} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <ModalHeader>
          <IconButton icon="arrow-back" onClick={onClose} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flex="1">
              {vidSrc && <VideoPlayer url={vidSrc} />}
              <HStack spacing={4} mt={4}>
                <Box fontWeight="bold">Episodes:</Box>
                <Select
                  values={[]}
                  onChange={(val) => onEpisodeChange(val)}
                  options={episodesOptions}
                  loading={episodesOptions?.length === 0}
                  dropdownPosition={'auto'}
                  style={{
                    color: 'black',
                    backgroundColor: 'inherit',
                    minWidth: '100px',
                  }}
                />
              </HStack>
            </Box>
            {animeDetail && (
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
