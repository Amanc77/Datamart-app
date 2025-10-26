import mongoose from "mongoose";

const startupFundingSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    valuation: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    startupName: {
      type: String,
      required: true,
    },
    amountRaised: {
      type: Number,
      required: true,
    },
    fs: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const StartupFunding = mongoose.model(
  "StartupFunding",
  startupFundingSchema
);
