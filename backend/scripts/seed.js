require("dotenv").config();
const mongoose = require("mongoose");

const Complaint = require("../src/modules/complaints/complaint.model");
const User = require("../src/modules/auth/user.model");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

const categories = [
  "Water Supply",
  "Roads & Infrastructure",
  "Electricity",
  "Sanitation & Waste",
  "Public Safety",
  "Healthcare",
  "Education",
  "Transportation",
  "Environment"
];

const departments = {
  "Water Supply": "Water & Sanitation Board",
  "Roads & Infrastructure": "Public Works Department",
  "Electricity": "Electricity Board",
  "Sanitation & Waste": "Municipal Sanitation Dept",
  "Public Safety": "Police Department",
  "Healthcare": "Public Health Department",
  "Education": "Education Department",
  "Transportation": "Transport Authority",
  "Environment": "Environmental Protection Agency"
};

const statuses = ["Submitted", "Under Review", "In Progress", "Resolved"];

const baseComplaints = [
  {
    title: "No water supply in Sector 5 for 3 days",
    description: "Our entire locality has not received water for three days.",
    location: "Sector 5, Shirpur",
    category: "Water Supply",
    urgencyScore: 9,
    urgencyLabel: "Critical"
  },
  {
    title: "Massive potholes on main highway",
    description: "Large potholes causing accidents on Shirpur highway.",
    location: "Shirpur Highway",
    category: "Roads & Infrastructure",
    urgencyScore: 8,
    urgencyLabel: "High"
  },
  {
    title: "Streetlights not working near market",
    description: "Streetlights have stopped working near the main market.",
    location: "Main Market Road",
    category: "Electricity",
    urgencyScore: 6,
    urgencyLabel: "Medium"
  },
  {
    title: "Garbage not collected for a week",
    description: "Waste has piled up creating hygiene issues.",
    location: "Ward 8",
    category: "Sanitation & Waste",
    urgencyScore: 7,
    urgencyLabel: "High"
  }
];

async function seedComplaints() {

  await connectDB();

  const user = await User.findOne();

  if (!user) {
    console.log("No user found. Create a user first.");
    process.exit(1);
  }

  await Complaint.deleteMany({});
  console.log("Old complaints removed");

  for (let i = 0; i < 20; i++) {

    const base = baseComplaints[i % baseComplaints.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const complaint = new Complaint({
      title: base.title,
      description: base.description,
      location: base.location,
      category: base.category,
      department: departments[base.category],
      urgencyScore: base.urgencyScore,
      urgencyLabel: base.urgencyLabel,
      sentiment: "Frustrated",
      aiSummary: base.description,
      citizen: user._id,
      status,
      statusHistory: [
        {
          status: "Submitted",
          note: "Complaint received",
          updatedBy: null,
          timestamp: new Date()
        }
      ]
    });

    if (status !== "Submitted") {
      complaint.statusHistory.push({
        status,
        note: "Status updated by admin",
        updatedBy: user._id,
        timestamp: new Date()
      });
    }

    if (status === "Resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save(); // triggers trackingId generation
  }

  console.log("Seeded 20 complaints successfully");

  mongoose.connection.close();
}

seedComplaints();