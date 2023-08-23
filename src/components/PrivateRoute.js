import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { Outlet, Navigate } from "react-router-dom";
import Loader from "./Loader";

const PrivateRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Loader />;
  else if (!user || error) {
    return <Navigate to="/login" replace />;
  } else return <Outlet />;
};

export default PrivateRoute;
