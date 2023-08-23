import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React, { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Podcasts from "./pages/Podcasts";
import CreatePodcast from "./pages/CreatePodcast";
import CreateEpisode from "./pages/CreateEpisode";
import PodcastDetail from "./pages/PodcastDetail";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/userSlice";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unSubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        //if any user is logged in extract its data
        const unSubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              //saving data to redux if userDoc exists
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: userData.uid,
                })
              );
            }
          },
          (error) => {
            toast.error(error.message);
          }
        );

        return () => {
          unSubscribeSnapshot();
        };
      }
    });

    return () => {
      unSubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/create" element={<CreatePodcast />} />
              <Route path="/podcast/:podcastId" element={<PodcastDetail />} />
              <Route
                path="/podcast/:podcastId/create-episode"
                element={<CreateEpisode />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
