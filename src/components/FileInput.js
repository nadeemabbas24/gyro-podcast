import React, { useState } from "react";

const FileInput = ({ id, accept, prompt, fileHandler }) => {
  const [fileSelected, setFileSelected] = useState("");
  const [textColor, setTextColor] = useState("grey");

  const changeHandler = (e) => {
    setFileSelected(e.target.files[0].name);
    setTextColor("aquamarine");
    fileHandler(e.target.files[0]);
  };

  return (
    <div
      style={{
        width: "95%",
        padding: "10px 5px",
        borderBottom: "2px solid aqua",
        height: "30px",
        fontSize: "1.3rem",
        color: textColor,
      }}
    >
      <label htmlFor={id} style={{ cursor: "pointer" }}>
        {fileSelected ? `"${fileSelected}" has been selected.` : prompt}
      </label>
      <input
        type="file"
        accept={accept}
        id={id}
        style={{ display: "none" }}
        onChange={changeHandler}
      />
    </div>
  );
};

export default FileInput;
