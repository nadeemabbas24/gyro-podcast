import React, { useState } from "react";
import styles from "../styles/form.module.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password == confPassword && password.length >= 6 && fullName && email) {
      setLoading((prev) => !prev);
      try {
        //creating user's Account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);

        //creating  user's detail in firestore
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: email,
          uid: user.uid,
        });

        //saving to local global state using redux
        dispatch(
          setUser({
            name: fullName,
            email: email,
            uid: user.uid,
          })
        );
        toast.success("user successfully signed up");
        setLoading(false);
        //after successfull signup take user to profile page
        navigate("/profile");
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      //warn user for some wrong  inputs in the signup form
      setLoading(false);
      if (password != confPassword)
        toast.error("password and confirm password do not match!");
      else if (password.length < 6)
        toast.error("password length should be more than 6 characters.");
    }
  };
  return (
    <div className={styles.formContainer}>
      <form onSubmit={(e) => handleSubmit(e)} className={styles.myform}>
        <input
          type="text"
          name="fname"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="User Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          name="ConfPassword"
          placeholder="Confirm Password"
          onChange={(e) => setConfPassword(e.target.value)}
          required
        />

        {loading ? <Loader /> : <button type="submit">Signup</button>}

        <div className={styles.info}>
          Already have an account !
          <Link to="/login" className={styles.info}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
