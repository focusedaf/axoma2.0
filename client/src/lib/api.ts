import axios from "axios";

const primaryApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const centralApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CENTRAL_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


export const registerUser = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_REGISTER!, payload);

export const loginUser = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_LOGIN!, payload);

export const generateOtp = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_GENERATE_OTP!, payload);

export const verifyOtp = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_VERIFY_OTP!, payload);

export const createProfile = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_SETUP_PROFILE!, payload);

export const getProfile = (payload: any) =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_GET_PROFILE!, payload);

export const getCurrentUser = () => primaryApi.get("/api/v1/auth/me");

export const logoutUser = () =>
  primaryApi.post(process.env.NEXT_PUBLIC_API_LOGOUT!);

export default { primaryApi, centralApi };
