import Razorpay from "razorpay";
import crypto from "crypto";
import { Purchase } from "../models/Purchase.model.js";
import { User } from "../models/User.model.js";
import { RealEstate } from "../models/RealEstate.model.js";
import { StartupFunding } from "../models/StartupFunding.model.js";
import mongoose from "mongoose";
import { Parser } from "json2csv";

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_ID_KEY?.trim();
  const keySecret = process.env.RAZORPAY_SECRET_KEY?.trim();
  if (!keyId || !keySecret) throw new Error("Razorpay keys missing!");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Create checkout order for dataset
export const createDatasetCheckout = async (req, res) => {
  try {
    const userId = req.id;
    const { datasetType, filters = {}, rowCount = 1 } = req.body;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    if (!["realestate", "startupfunding"].includes(datasetType))
      return res
        .status(400)
        .json({ success: false, message: "Invalid dataset type" });
    if (rowCount < 1)
      return res.status(400).json({ success: false, message: "Row count ≥ 1" });

    const amountUSD = rowCount * 0.05;
    const amountINR = Math.round(amountUSD * 84 * 100);

    // Create purchase record
    const purchase = await Purchase.create({
      userId,
      datasetType,
      filters,
      rowCount,
      amount: amountUSD,
      status: amountUSD === 0 ? "completed" : "pending",
      paymentId: amountUSD === 0 ? "FREE" : null,
    });

    // Free dataset
    if (amountUSD === 0) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchases: purchase._id },
      });
      return res.json({
        success: true,
        isFree: true,
        purchaseId: purchase._id,
      });
    }

    // Paid dataset → create Razorpay order
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountINR,
      currency: "INR",
      receipt: `order_${purchase._id}`,
    });

    purchase.paymentId = order.id;
    await purchase.save();

    const user = await User.findById(userId);
    res.json({
      success: true,
      isFree: false,
      order_id: order.id,
      amount_paise: amountINR,
      key_id: process.env.RAZORPAY_ID_KEY,
      name: "DataMart",
      description: `Buy ${rowCount} rows – ${datasetType}`,
      prefill: {
        name: user.name || "User",
        email: user.email || "user@example.com",
      },
    });
  } catch (error) {
    console.error("createDatasetCheckout:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

// Razorpay webhook for payment status
export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature)
      return res
        .status(400)
        .json({ success: false, message: "Missing signature" });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");
    if (expected !== signature)
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });

    const event = JSON.parse(req.body.toString());
    if (event.event === "payment.captured") {
      const payEntity = event.payload.payment.entity;
      const order_id = payEntity.order_id;
      const payment_id = payEntity.id;
      const amountUSD = Number((payEntity.amount / 100 / 84).toFixed(2));

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const purchase = await Purchase.findOne({
          paymentId: order_id,
        }).session(session);
        if (purchase && purchase.status !== "completed") {
          purchase.status = "completed";
          purchase.amount = amountUSD;
          purchase.razorpayPaymentId = payment_id;
          await purchase.save({ session });
          await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { purchases: purchase._id } },
            { session }
          );
        }

        await session.commitTransaction();
        return res.status(200).json({ success: true });
      } catch (err) {
        await session.abortTransaction();
        console.error("Webhook error:", err);
        return res
          .status(400)
          .json({ success: false, message: `Webhook Error: ${err.message}` });
      } finally {
        session.endSession();
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("razorpayWebhook:", error);
    return res
      .status(400)
      .json({ success: false, message: `Webhook Error: ${error.message}` });
  }
};

// Verify payment signature after checkout
export const verifyDatasetPayment = async (req, res) => {
  try {
    const userId = req.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (sign !== razorpay_signature)
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });

    const purchase = await Purchase.findOne({ paymentId: razorpay_order_id });
    if (!purchase || purchase.userId.toString() !== userId)
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });

    if (purchase.status !== "completed") {
      purchase.status = "completed";
      purchase.razorpayPaymentId = razorpay_payment_id;
      await purchase.save();
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchases: purchase._id },
      });
    }

    res.json({ success: true, message: "Payment verified!" });
  } catch (error) {
    console.error("verifyDatasetPayment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch completed purchases for logged-in user
export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });

    const user = await User.findById(userId)
      .populate({
        path: "purchases",
        match: { status: "completed" },
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    res.json({ success: true, data: user?.purchases || [] });
  } catch (error) {
    console.error("getMyPurchases:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Download dataset as CSV
export const downloadDataset = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.id;

    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Login required" });
    if (!mongoose.Types.ObjectId.isValid(purchaseId))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const purchase = await Purchase.findOne({
      _id: purchaseId,
      userId,
      status: "completed",
    });
    if (!purchase)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const Model =
      purchase.datasetType === "realestate" ? RealEstate : StartupFunding;
    const filters = purchase.filters || {};
    const query = {};

    // Apply filters based on dataset type
    if (purchase.datasetType === "realestate") {
      if (filters.city) query.city = { $regex: filters.city, $options: "i" };
      if (filters.minPrice) query.price = { $gte: Number(filters.minPrice) };
      if (filters.yearFrom)
        query.yearBuilt = {
          ...(query.yearBuilt || {}),
          $gte: Number(filters.yearFrom),
        };
      if (filters.yearTo)
        query.yearBuilt = {
          ...(query.yearBuilt || {}),
          $lte: Number(filters.yearTo),
        };
    } else {
      if (filters.country)
        query.country = { $regex: filters.country, $options: "i" };
      if (filters.industry)
        query.industry = { $regex: filters.industry, $options: "i" };
      if (filters.minAmountRaised)
        query.amountRaised = { $gte: Number(filters.minAmountRaised) };
      if (filters.yearFrom)
        query.year = { ...(query.year || {}), $gte: Number(filters.yearFrom) };
      if (filters.yearTo)
        query.year = { ...(query.year || {}), $lte: Number(filters.yearTo) };
    }

    const data = await Model.find(query)
      .sort(
        purchase.datasetType === "realestate"
          ? { price: -1 }
          : { amountRaised: -1 }
      )
      .limit(purchase.rowCount)
      .lean();

    if (data.length === 0)
      return res.status(404).json({ success: false, message: "No data found" });

    // Convert to CSV
    const fields = Object.keys(Model.schema.paths).filter(
      (k) => !["__v", "createdAt", "updatedAt", "_id"].includes(k)
    );
    const csv = new Parser({ fields }).parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${purchase.datasetType}_${purchaseId}.csv`);
    res.send(csv);
  } catch (error) {
    console.error("downloadDataset:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
