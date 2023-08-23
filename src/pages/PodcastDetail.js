import React, { useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import styles from "../styles/podcast-detail.module.css";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setEpisode } from "../slices/episodeSlice";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import PlayPauseBtn from "../components/PlayPauseBtn";

const PodcastDetail = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [podcast, setPodcast] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playIndex, setPlayIndex] = useState(-1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episode.episode);

  const { podcastId } = useParams();
  console.log("id in podcasdetail come through useparam =>", podcastId);

  useEffect(() => {
    if (podcastId) {
      setLoading(true);
      console.log("getting data thruogh this id ", podcastId);
      getData();
    }
  }, [podcastId]);

  const getData = async () => {
    try {
      // const docRef = doc(db, "podcasts", podcastId);
      // const docSnap = await getDoc(docRef);
      // if (docSnap.exists()) {
      //   setPodcast({ id: podcastId, ...docSnap.data() });
      //   console.log("snapshot ", docSnap);
      //   setLoading(false);
      // } else {
      //   toast.error("No such document found!");
      //   setLoading(false);
      // }
      onSnapshot(
        doc(db, "podcasts", podcastId),
        (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPodcast({ id: podcastId, ...userData });
            setLoading(false);
          } else {
            toast.error("No such document found!");
            setLoading(false);
          }
        },
        (error) => {
          toast.error(error.message);
        }
      );
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    //querying for each episodes in a podcsat
    console.log("querying for each episode in a podcast using same id");
    const unSubscribe = onSnapshot(
      query(collection(db, "podcasts", podcastId, "episodes")),
      (querySnapshot) => {
        const episodeData = [];
        querySnapshot.forEach((doc) => {
          episodeData.push({ id: doc.id, ...doc.data() });
        });
        //saving to local global state using redux
        dispatch(setEpisode(episodeData));
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unSubscribe();
    };
  }, [podcastId]);

  //take u to the episode form of podcast by its id
  const createEpisodeHandler = () => {
    navigate(`/podcast/${podcastId}/create-episode`);
  };

  //just for toggling play/pause
  const pauseHandler = () => {
    setIsPlay((pre) => !pre);
  };

  //on selection of particular episode it sets the related audio file
  const playHandler = (file) => {
    setIsPlay((prev) => {
      setCurrentAudio(file);
      return !prev;
    });
  };

  return (
    (loading && <Loader />) ||
    (podcast && (
      <div className={styles.container}>
        <div className={styles.dataContainer}>
          <div className={styles.header}>
            <p className={styles.title}>{podcast.title}</p>
            <button
              className={styles.creatEpisodeBtn}
              onClick={createEpisodeHandler}
            >
              Create Episode
            </button>
          </div>
          <div className={styles.banner}>
            <div className={styles.imageContainer}>
              <img src={podcast.bannerImage} />
            </div>
            <div className={styles.desc}>
              <p>{podcast.desc}</p>
            </div>
          </div>

          {/* Episodes playlist */}
          <div className={styles.episodeContainer}>
            <p className={styles.title}>Episodes :</p>
            {episodes.length &&
              episodes.map((episode, index) => {
                return (
                  <div key={index} className={styles.episodeData}>
                    <p> {index + 1}.</p>
                    <PlayPauseBtn
                      key={index}
                      playIndex={playIndex}
                      podIndex={index}
                      pause={pauseHandler}
                      playButton={() => playHandler(episode.audioUrl)}
                      setSelected={(index) => setPlayIndex(index)}
                    />
                    <p>
                      {episode.title} - {episode.desc}
                    </p>
                  </div>
                );
              })}

            {!episodes.length && <p>No Episode found, create one.</p>}
          </div>
        </div>
        {/* audio player */}
        <div className={styles.audioContainer}>
          {currentAudio && (
            <AudioPlayer imageSrc={podcast.thumbnail} audioUrl={currentAudio} />
          )}
        </div>
      </div>
    ))
  );
};

export default PodcastDetail;
