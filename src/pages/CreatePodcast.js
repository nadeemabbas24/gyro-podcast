import React, { useState } from "react";
import styles from "../styles/form.module.css";
import FileInput from "../components/FileInput";
import { toast } from "react-toastify";
import { auth, storage, db } from "../firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const CreatePodcast = () => {
  // const [title, setTitle] = useState("");
  // const [desc, setDesc] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setTitle(e.target.title.value);
    // setDesc(e.target.desc.value);
    const title = e.target.title.value;
    const desc = e.target.desc.value;

    if (title && desc) {
      if (!auth.currentUser) {
        toast.error("please login first");
        navigate("/login");
      }
      try {
        //upload banner image files and get downloadable link
        const bannerRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerRef, bannerImage);
        const bannerImageUrl = await getDownloadURL(bannerRef);

        //upload thumbnail image files and get downloadable link
        const thumbnailRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(thumbnailRef, thumbnail);
        const thumbnailUrl = await getDownloadURL(thumbnailRef);

        //create a new doc file in a new collection called podcasts
        const podcastData = {
          title,
          desc,
          bannerImage: bannerImageUrl,
          thumbnail: thumbnailUrl,
          user: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, "podcasts"), podcastData);

        //now redirect to podcast page with docref id as a parameter
        toast.success("Podcast created successfully!");
        console.log("path====", `/podcasts/${docRef.id}`);
        // navigate(`/podcasts/${docRef.id}`);
        navigate(`/podcasts`);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandotory.");
      setLoading(false);
    }
  };

  const thumbnailHandler = (file) => {
    setThumbnail(file);
  };

  const bannerHandler = (file) => {
    setBannerImage(file);
  };
  return (
    <div className={styles.formContainer}>
      <h1>Create A Podcast</h1>
      <form className={styles.myform} onSubmit={submitHandler}>
        <input type="text" placeholder="Podcast Title" name="title" />
        <input type="text" placeholder="Podcast Description" name="desc" />

        <FileInput
          id="banner"
          prompt="Upload Image for Banner"
          accept="image/*"
          fileHandler={(e) => bannerHandler(e)}
        />

        <FileInput
          id="thumbnail"
          prompt="Upload Image for Thumbnail/Podcast"
          accept="image/*"
          fileHandler={(e) => thumbnailHandler(e)}
        />
        {loading ? <Loader /> : <button>Create Now</button>}
      </form>
    </div>
  );
};

export default CreatePodcast;
