import { RealEstate } from "../models/RealEstate.model.js";
import { StartupFunding } from "../models/StartupFunding.model.js";
import { realEstateData } from "./SampleRealEstateData.js";
import { startupFundingData } from "./SampleStartupFundingData.js";

export const createDatasets = async () => {
  try {
    const realEstateCount = await RealEstate.countDocuments();
    const startupFundingCount = await StartupFunding.countDocuments();

    if (realEstateCount === 0) {
      await RealEstate.insertMany(realEstateData);

      console.log("Real Estate sample data created successfully");
    } else {
      console.log("Real Estate data already exists");
    }

    if (startupFundingCount === 0) {
      await StartupFunding.insertMany(startupFundingData);
      console.log("Startup Funding sample data created successfully");
    } else {
      console.log("Startup Funding data already exists");
    }
  } catch (error) {
    console.error("Error while creating  datasets:", error.message);
  }
};
