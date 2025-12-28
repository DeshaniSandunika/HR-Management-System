import axios from "./axios";

export const applyLeave = (data) =>
  axios.post("/leaves", data);

export const getAllLeaves = () =>
  axios.get("/leaves");

export const getMyLeaves = () =>
  axios.get("/leaves/my");

export const updateLeaveStatus = (id, data) =>
  axios.put(`/leaves/${id}`, data);

export const deleteLeave = (id) =>
  axios.delete(`/leaves/${id}`);
