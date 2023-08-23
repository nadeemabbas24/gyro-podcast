import React, { useEffect, useState } from "react";
import styles from "../styles/play-pause-btn.module.css";
import {
  FaPlayCircle,
  FaPodcast,
  FaSatelliteDish,
  FaStopCircle,
  FaWifi,
} from "react-icons/fa";
import Loader from "./Loader";
const PlayPauseBtn = ({
  playButton,
  setSelected,
  podIndex,
  playIndex,
  pause,
}) => {
  const [isActive, setIsActive] = useState(false);

  const clickHandler = (e) => {
    if (podIndex === playIndex) {
      pause();
      if (isActive) setIsActive(false);
      return;
    }
    setSelected(() => {
      setIsActive(true);
      playButton();
      return podIndex;
    });
  };

  useEffect(() => {
    if (podIndex === playIndex) {
      setIsActive(true);
    } else setIsActive(false);
  }, [setSelected]);

  return (
    <div className={styles.container} onClick={(e) => clickHandler(e)}>
      {isActive && (
        <FaPodcast
          style={{
            color: "aqua",
            boxShadow: "2px 2px 10px rgb(253,0,253)",
            background: "rgb(253,0,253)",
            borderRadius: "50%",
          }}
        />
      )}
      {!isActive && <FaPlayCircle />}
    </div>
  );
};

export default PlayPauseBtn;
