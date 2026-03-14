const Attendance = require("../models/Attendance.js");
const Membership = require("../models/Membership.js");
const mongoose = require("mongoose");

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

      const absentCount = totalWorkers - totalPresent - leaveCount

      res.json({
         totalPresent,
         leaveCount,
         totalWorkers,
         absentCount
      });

   } catch (error) {
      res.status(500).json(error.message)
   }
};

exports.getDashboardAnalytics = async (req, res) => {
   try {

      const { startDate, endDate } = req.query;

      let match = {
         organizationId: new mongoose.Types.ObjectId(req.orgId)
      };

      if (startDate || endDate) {

         match.date = {};

         if (startDate) {
            match.date.$gte = new Date(startDate);
         }
         const end = new Date(endDate);
         end.setHours(23, 59, 59, 999);
         match.date.$lte = end;
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

      const totalRecords = present + leave + absent;

      const attendancePercentage =
         totalRecords === 0 ? 0 : ((present / totalRecords) * 100).toFixed(2);

      const leavePercentage =
         totalRecords === 0 ? 0 : ((leave / totalRecords) * 100).toFixed(2);

      const absentPercentage =
         totalRecords === 0 ? 0 : ((absent / totalRecords) * 100).toFixed(2);

      console.log("MATCH FILTER:", match);


      const trend = await Attendance.aggregate([
         { $match: match },

         {
            $group: {
               _id: {
                  $dateToString: {
                     format: "%Y-%m-%d",
                     date: { $toDate: "$date" }
                  }
               },

               present: {
                  $sum: {
                     $cond: [{ $eq: ["$status", "present"] }, 1, 0]
                  }
               },

               total: { $sum: 1 }
            }
         },

         {
            $project: {
               date: "$_id",

               percentage: {
                  $cond: [
                     { $eq: ["$total", 0] },
                     0,
                     {
                        $multiply: [
                           { $divide: ["$present", "$total"] },
                           100
                        ]
                     }
                  ]
               }
            }
         },

         { $sort: { date: 1 } }

      ]);
      console.log("TREND RESULT:", trend);

      res.json({
         present,
         leave,
         absent,
         attendancePercentage,
         leavePercentage,
         absentPercentage,
         trend
      });

   } catch (error) {

      console.error(error);

      res.status(500).json({
         message: "Analytics server error",
         error: error.message
      });

   }
};