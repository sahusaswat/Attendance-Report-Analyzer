const csv = require("csv-parser");
const stream = require("stream");
const User = require("../models/User.js");
const Attendance = require("../models/Attendance.js");

exports.uploadAttendance = async (req, res) => {
    try {
        const results = [];

        const convertBufferStream = new stream.PassThrough();
        convertBufferStream.end(req.file.buffer);

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
                    if(!user) {
                        skipped.push(row.email);
                        continue
                    }

                    await Attendance.create({
                        userId: user._id,
                        date: row.date,
                        inTime: row.inTime,
                        outTime: row.outTime
                    });
                    success++;
                }
                res.status(201).json({message: "Attendance Processed!", success, skipped})
            })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};