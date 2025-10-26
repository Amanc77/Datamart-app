import { RealEstate } from "../models/RealEstate.model.js";
import { StartupFunding } from "../models/StartupFunding.model.js";

export const getRealEstate = async (req, res) => {
  try {
    const data = await RealEstate.find({});
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getRealEstate:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch real estate dataset",
    });
  }
};

export const getStartupFunding = async (req, res) => {
  try {
    const data = await StartupFunding.find({});
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getStartupFunding:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch startup funding dataset",
    });
  }
};
