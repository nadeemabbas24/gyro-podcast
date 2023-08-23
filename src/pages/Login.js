import React, { useState } from "react";
import styles from "../styles/form.module.css";
import Loader from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;
    let password = e.target.password.value;

    try {
      setLoading(true);
      //signing in by  users
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      //geting user's detail
      const snapShot = await getDoc(doc(db, "users", user.uid)).then((data) => {
        return data.data();
      });

      //saving to local global state using redux
      console.log("snapshot ", snapShot.name);
      dispatch(
        setUser({
          name: snapShot.name,
          email: snapShot.email,
          uid: user.uid,
        })
      );

      toast.success("user logged in succesfully");
      setLoading(false);

      //after successfull signup take user to profile page
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      toast.error("error: " + error.message);
    }
  };
  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.myform}>
        <input type="email" name="email" placeholder="User Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {loading ? <Loader /> : <button type="submit">Login</button>}
        <div className={styles.info}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.info}>
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
