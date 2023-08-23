import React, { useState } from "react";
import FileInput from "../components/FileInput";
import styles from "../styles/form.module.css";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const CreateEpisode = () => {
  const [audioFile, setAudioFile] = useState("");
  const { podcastId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log("id in createEpisode ", podcastId);
  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let title = e.target.title.value;
    let desc = e.target.desc.value;

    if (title && desc && podcastId) {
      try {
        const audioRef = ref(
          storage,
          `episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(audioRef, audioFile);
        const audioUrl = await getDownloadURL(audioRef);

        //create a new doc file in a new collection called podcasts
        const episodeData = {
          title,
          desc,
          audioUrl: audioUrl,
          user: auth.currentUser.uid,
        };
        const docRef = await addDoc(
          collection(db, "podcasts", podcastId, "episodes"),
          episodeData
        );
        setLoading(false);
        toast.success("Episode created successfully.");
        // navigate(`/podcast/${docRef.id}`);
        console.log("this is doc.id in creatEpisode");
        navigate(`/podcast/${podcastId}`);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory.");
      setLoading(false);
    }
  };

  const audioHandler = (file) => {
    setAudioFile(file);
    console.log(file, audioFile);
  };
  return (
    <div className={styles.formContainer}>
      {(loading && <Loader />) || (
        <>
          <h1>Create An Episode</h1>
          <form className={styles.myform} onSubmit={submitHandler}>
            <input type="text" placeholder="Episode Title" name="title" />
            <input type="text" placeholder="Episode Description" name="desc" />
            <FileInput
              id="audio"
              prompt="Upload audio file"
              accept="audio/*"
              fileHandler={(e) => audioHandler(e)}
            />
            <button type="submit">Create Now</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateEpisode;
