import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import Datasets from "./components/Datasets";
import { Toaster } from "sonner";
import StartupFundingDataset from "./components/StartupFundingDataset";
import RealEstateDataset from "./components/RealEstateDataset";
import MyPurchases from "./components/MyPurchases";
import NotFound from "./pages/NotFound";
import { useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "./features/authSlice";
import axiosInstance from "./api/axios";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        if (res.data.success) {
          dispatch(userLoggedIn({ user: res.data.user }));
        }
      } catch (err) {
        console.log(err);
        dispatch(userLoggedOut());
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/logout" element={<Auth />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route
          path="/datasets/fundedstartup"
          element={<StartupFundingDataset />}
        />
        <Route path="/datasets/estate" element={<RealEstateDataset />} />
        <Route path="/myPurchases" element={<MyPurchases />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
