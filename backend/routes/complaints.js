const express = require("express");
const Complaint = require("../models/Complaint");

const router = express.Router();

// ✅ GET ALL COMPLAINTS
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch complaints." });
  }
});

// ✅ CREATE COMPLAINT
router.post("/", async (req, res) => {
  try {
    const { category, description, userId } = req.body;

    if (!category || !description || !userId) {
      return res.status(400).json({ message: "Category, description, and userId are required." });
    }

    const complaint = await Complaint.create({
      category,
      description,
      userId,
      status: "Pending",
      votes: 0
    });

    res.status(201).json({ 
      message: "Complaint submitted successfully.",
      complaint: {
        _id: complaint._id,
        category: complaint.category,
        description: complaint.description,
        status: complaint.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit complaint." });
  }
});

// ✅ GET USER COMPLAINTS
router.get("/user/:id", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user complaints." });
  }
});

// ✅ VOTE
router.put("/:id/vote", async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || (value !== 1 && value !== -1)) {
      return res.status(400).json({ message: "Vote value must be 1 or -1." });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    complaint.votes += value;
    await complaint.save();

    res.json({ message: "Vote updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update vote." });
  }
});

// ✅ UPDATE STATUS (ADMIN)
router.put("/:id/status", async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    complaint.status = status;
    complaint.remarks = remarks || "";

    await complaint.save();

    res.json({ message: "Complaint updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update complaint." });
  }
});

// ✅ DELETE (WITHDRAW)
router.delete("/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete complaint." });
  }
});

module.exports = router;