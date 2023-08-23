import React from "react";
import styles from "../styles/card.module.css";

const Card = ({ podcast, navigate }) => {
  console.log("podcast detail in card", podcast);
  return (
    <div className={styles.card} onClick={() => navigate(podcast.id)}>
      <img src={podcast.thumbnail} />
      <p>{podcast.title}</p>
    </div>
  );
};

export default Card;
