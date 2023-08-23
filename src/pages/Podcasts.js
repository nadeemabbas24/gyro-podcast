import React, { useEffect, useState } from "react";
import styles from "../styles/podcasts.module.css";
import AudioPlayer from "../components/AudioPlayer";
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setPodcast } from "../slices/podcastSlice";
import Podcast from "./Podcast";
import { toast } from "react-toastify";

const Podcasts = () => {
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcast.podcasts);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const unSubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastData = [];
        querySnapshot.forEach((doc) => {
          podcastData.push({ id: doc.id, ...doc.data() });
        });
        //saving/updating to local global state using redux dispatch action
        dispatch(setPodcast(podcastData));
        console.log(podcastData);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unSubscribe();
    };
  }, []);

  //searching podcast by its title localy not on firestore
  const searchHandler = (e) => {
    let find = e.target.value;
    console.log(e.target.value);
    let searched = podcasts.filter((item) => {
      if (item.title.toLowerCase().includes(find.toLowerCase())) return item;
    });

    setFiltered(searched);
  };

  return (
    <div className={styles.container}>
      <h1>Discover Podcasts</h1>
      <input
        type="text"
        placeholder="Search Podcast by Title"
        name="search"
        onInput={(e) => searchHandler(e)}
      />
      {podcasts.length > 0 ? (
        <Podcast podcasts={filtered.length > 0 ? filtered : podcasts} />
      ) : (
        <h2>no podcasts found</h2>
      )}
    </div>
  );
};

export default Podcasts;
