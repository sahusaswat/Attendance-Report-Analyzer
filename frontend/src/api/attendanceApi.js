import instance from "./axiosApi";

export const getAttendanceByUser = async (userId) => {
    const res = await instance.get(`/attendance/user/${userId}`);
    return res.data;
}
