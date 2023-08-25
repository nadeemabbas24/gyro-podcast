import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/audio-player.module.css";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const AudioPlayer = ({ imageSrc, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const audioRef = useRef();
  // console.log("props audiour:", audioUrl);
  const onPlayHandler = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
    } else {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  const volumeHandler = (e) => {
    audioRef.current.volume = +e.target.value;
    setVolume(+e.target.value);
    setIsMute(false);
  };

  const muteHandler = (e) => {
    setIsMute((prev) => {
      //if volume is unmuted
      if (!prev) {
        audioRef.current.volume = 0;
      } else audioRef.current.volume = volume;
      return !prev; //toggle volume
    });
  };
  const updateTimer = () => {
    setCurrentTime(+audioRef.current.currentTime);
  };

  const metadataHandler = () => {
    setDuration(+audioRef.current.duration);
    setIsPlaying(false);
  };

  const endedHandler = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    console.log("current audio url", audioUrl);

    audio.load();
    console.log("metadatahandler useeffect", audioRef.current.duration);
    audio.addEventListener("loadedmetadata", metadataHandler);
    audio.addEventListener("timeupdate", updateTimer);
    audio.addEventListener("ended", endedHandler);
    return () => {
      audio.removeEventListener("timeupdate", updateTimer);
      audio.removeEventListener("loadedmetadata", metadataHandler);
      audio.removeEventListener("ended", endedHandler);
    };
  }, []);

  return (
    <div className={styles.audio_player}>
      <audio src={audioUrl} type="audio/*" ref={audioRef}></audio>
      <div className={styles.image}>
        <img src={imageSrc} alt="" />
      </div>

      {/* track controller */}
      <div className={styles.duration}>
        {isPlaying ? (
          <FaPause onClick={onPlayHandler} />
        ) : (
          <FaPlay onClick={onPlayHandler} />
        )}
        <div className={styles.startTime}>
          <p>{currentTime.toFixed(2)}</p>
        </div>
        <input
          type="range"
          value={currentTime}
          onChange={(e) => (audioRef.current.currentTime = +e.target.value)}
          min={0}
          max={duration}
          step={0.01}
        />
        <p>{duration.toFixed(2)}</p>
      </div>

      {/* volume controller */}
      <div className={styles.volume}>
        {isMute ? (
          <FaVolumeMute onClick={muteHandler} />
        ) : (
          <FaVolumeUp onClick={muteHandler} />
        )}
        <input
          type="range"
          value={volume}
          onChange={(e) => volumeHandler(e)}
          min={0}
          max={1}
          step={0.01}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
