import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/header.module.css";

const Header = () => {
  return (
    <div className={styles.navbar}>
      <nav className={styles.nav_item}>
        <NavLink
          to={"/signup"}
          style={({ isActive }) => ({
            color: isActive ? "aqua" : "",
          })}
        >
          Signup
        </NavLink>
        <NavLink
          to={"/podcasts"}
          style={({ isActive }) => ({
            color: isActive ? "aqua" : "",
          })}
        >
          Podcasts
        </NavLink>
        <NavLink
          to={"/create"}
          style={({ isActive }) => ({
            color: isActive ? "aqua" : "",
          })}
        >
          Start a Podcast
        </NavLink>
        <NavLink
          to={"/profile"}
          style={({ isActive }) => ({
            color: isActive ? "aqua" : "",
          })}
        >
          Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;
