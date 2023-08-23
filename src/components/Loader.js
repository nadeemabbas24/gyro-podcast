import React from "react";
import styles from "../styles/loader.module.css";

const Loader = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loader;
