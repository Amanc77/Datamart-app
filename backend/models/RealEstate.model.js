import mongoose from "mongoose";

const realEstateSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    sqft: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    yearBuilt: {
      type: Number,
      required: true,
    },
    propertyId: {
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

export const RealEstate = mongoose.model("RealEstate", realEstateSchema);
