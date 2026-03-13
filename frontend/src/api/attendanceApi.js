import instance from "./axiosApi";

export const getAttendanceByUser = async (userId, startDate, endDate) => {
    const res = await instance.get(`/attendance/user/${userId}`, {
        params: { startDate, endDate }
    });
    return res.data;
};

export const getTeamAttendance = async (startDate, endDate) => {

    const res = await instance.get("/attendance/team-attendance", {
        params: { startDate, endDate }
    });

    return res.data;
};