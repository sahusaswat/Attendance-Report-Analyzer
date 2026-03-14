const Attendance = require("../models/Attendance.js");
const Membership = require("../models/Membership.js")

exports.getTodayStats = async (req, res) => {
   try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const totalPresent = await Attendance.countDocuments({
         organizationId: req.orgId,
         status: "present",
         date: { $gte: today, $lt: tomorrow }
      });

      const leaveCount = await Attendance.countDocuments({
         organizationId: req.orgId,
         status: "leave",
         date: { $gte: today, $lt: tomorrow }
      });

      const totalWorkers = await Membership.countDocuments({
         orgId: req.orgId,
         role: { $in: ["manager", "member"] }
      });

      res.json({
         totalPresent,
         leaveCount,
         totalWorkers
      });

   } catch (error) {
      res.status(500).json(error.message)
   }
};

exports.getDashboardAnalytics = async (req, res) => {

   const { startDate, endDate } = req.query;

   let match = {
      organizationId: req.orgId
   };

   if (startDate || endDate) {

      match.date = {};

      if (startDate) {
         match.date.$gte = new Date(startDate);
      }

      if (endDate) {
         match.date.$lte = new Date(endDate);
      }

   }

   const present = await Attendance.countDocuments({
      ...match,
      status: "present"
   });

   const leave = await Attendance.countDocuments({
      ...match,
      status: "leave"
   });

   const absent = await Attendance.countDocuments({
      ...match,
      status: "absent"
   });

   const topPerformers = await Attendance.aggregate([
      { $match: { ...match, status: "present" } },

      {
         $group: {
            _id: "$userId",
            presentDays: { $sum: 1 }
         }
      },

      { $sort: { presentDays: -1 } },
      { $limit: 3 },

      {
         $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
         }
      },

      { $unwind: "$user" },

      {
         $project: {
            name: "$user.name",
            presentDays: 1
         }
      }
   ]);

   const lowPerformers = await Attendance.aggregate([

      { $match: match },

      {
         $group: {
            _id: "$userId",
            presentDays: {
               $sum: {
                  $cond: [{ $eq: ["$status", "present"] }, 1, 0]
               }
            }
         }
      },

      { $sort: { presentDays: 1 } },
      { $limit: 3 },

      {
         $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
         }
      },

      { $unwind: "$user" },

      {
         $project: {
            name: "$user.name",
            presentDays: 1
         }
      }

   ]);
   res.json({
      present,
      leave,
      absent,
      topPerformers,
      lowPerformers
   });
};