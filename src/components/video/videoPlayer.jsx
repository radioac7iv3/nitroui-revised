import { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

const playerConfig = {
  autoPlay: false,
  controls: true,
  width: '100%',
  height: '100%',
};

const VideoPlayer = (props) => {
  const { url } = props;

  const vidUrl = useMemo(() => {
    return url || '';
  }, [url]);

  return <ReactPlayer url={vidUrl} {...playerConfig} />;
};

export default VideoPlayer;
