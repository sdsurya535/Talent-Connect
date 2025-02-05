import axiosInstance from "@/config/axios";

export const userService = {
  getProfile: () => axiosInstance.get("/api/user/profile"),
  updateProfile: (data) => axiosInstance.put("/api/user/profile", data),
  getUsers: () => axiosInstance.get("/api/users"),
  createUser: (data) => axiosInstance.post("/api/users", data),
};
