import instance from "./axiosApi";

export const getAttendanceByUser = async (userId, startDate, endDate) => {
    const res = await instance.get(`/attendance/user/${userId}`, {
        params: { startDate, endDate }
    });
    return res.data;
}
