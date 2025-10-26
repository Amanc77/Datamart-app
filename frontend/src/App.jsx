import React from "react";
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route
          path="/datasets/fundedstartup"
          element={<StartupFundingDataset />}
        />
        <Route path="/datasets/estate" element={<RealEstateDataset />} />
        <Route path="/myPurchases" element={<MyPurchases />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
