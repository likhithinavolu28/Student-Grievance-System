const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    votes: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Resolved", "Rejected"],
      default: "Pending"
    },
    remarks: {
      type: String,
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
