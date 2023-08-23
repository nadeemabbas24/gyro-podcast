import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/profile.module.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Loader from "../components/Loader";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Profile = () => {
  //fetching user data from redux/global state
  const user = useSelector((state) => state.user.user);
  const [podcast, setPodcast] = useState([]);

  useEffect(() => {
    //fetching data of logged in user from firestore
    //where user refers to user.uid
    const fetchDoc = async () => {
      const q = query(
        collection(db, "podcasts"),
        where("user", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //storing data to local state using useState
      setPodcast(docsData);
      console.log(docsData);
    };
    if (user) fetchDoc();
  }, [user]);

  if (!user) return <Loader />;

  //function for logout of user
  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        toast.success("User logged out successfully.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className={styles.container}>
      <p className={styles.header}>Profile</p>
      <div>
        <p>User: {user.name}</p>
      </div>
      <div>
        <p>Email: {user.email}</p>
      </div>
      <div>
        <p>User ID: {user.uid}</p>
      </div>
      <p>
        <em>Created Podcasts --</em>
      </p>
      <ol>
        {/* getting information of podcast cretated by this user */}
        {podcast.length > 0 ? (
          podcast.map((item) => {
            return <li>{item.title}</li>;
          })
        ) : (
          <p> 0 Podcast created</p>
        )}
      </ol>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default Profile;
