import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      enum: ["hod", "college_admin", "hostel_admin"],
      required: true,
    },
    details: {
      deptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: function () {
          return this.from === "hod";
        },
      },
      deptName: {
        type: String,
        required: function () {
          return this.from === "hod";
        },
      },
      hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: function () {
          return this.from === "hostel_admin";
        },
      },
      hostelName: {
        type: String,
        required: function () {
          return this.from === "hostel_admin";
        },
      },
      collegeName: {
        type: String,
        required: function () {
          return this.from === "college_admin";
        },
      },
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
