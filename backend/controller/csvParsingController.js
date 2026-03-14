const csv = require("csv-parser");
const stream = require("stream");
const User = require("../models/User.js");
const Attendance = require("../models/Attendance.js");

exports.uploadAttendance = async (req, res) => {
    try {
        const results = [];

        const convertBufferStream = new stream.PassThrough();
        convertBufferStream.end(req.file.buffer);

        function calculateStatus(inTime, outTime) {
            const [inH, inM] = inTime.split(":").map(Number);
            const [outH, outM] = outTime.split(":").map(Number);

            const inMinutes = inH * 60 + inM;
            const outMinutes = outH * 60 + outM;
            if (outMinutes <= inMinutes) return "absent";
            const hoursWorked = (outMinutes - inMinutes) / 60;
            if (hoursWorked >= 8) return "present";
            if (hoursWorked >= 4) return "half-day";
            return "absent";
        }

        convertBufferStream
            .pipe(csv())
            .on("data", (data) => {
                results.push(data)
            })
            .on("end", async () => {
                let success = 0;
                let skipped = [];

                for (const row of results) {
                    const user = await User.findOne({ email: row.email })
                    if (!user) {
                        skipped.push(row.email);
                        continue
                    }
                    const status = calculateStatus(row.inTime, row.outTime)
                    await Attendance.updateOne(
                        {
                            userId: user._id,
                            organizationId: req.orgId,
                            date: new Date(row.date)
                        },
                        {
                            $set: {
                                status,
                                markedBy: req.user.id,
                                inTime: row.inTime,
                                outTime: row.outTime
                            }
                        },
                        { upsert: true }
                    );
                    success++;
                }
                res.status(201).json({ message: "Attendance Processed!", success, skipped })
            })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};