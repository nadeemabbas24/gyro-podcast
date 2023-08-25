import React from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

const Podcast = ({ podcasts }) => {
  const navigate = useNavigate();

  const gotoDetailPage = (id) => {
    console.log("gotoedetailpage", id);
    navigate(`/podcast/${id}`);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        margin: "2rem",
        flexWrap: "wrap",
      }}
    >
      {podcasts.map((item) => (
        <Card key={item.id} podcast={item} navigate={gotoDetailPage} />
      ))}
    </div>
  );
};

export default Podcast;
