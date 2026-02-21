import instance from "./axiosApi";

export const markAttendance = async (data) => {
    const res = await instance.post("/attendance/mark-it", data);
     return res.data
};

export const getAttendanceByUser = async (userId) => {
    const res = await instance.get(`/attendance/user/${userId}`);
    return res.data;
}

export const getAttendanceByDate = async (date) => {
    const res = await instance.get(`/attendance/date?date=${date}`)
    return res.data
}