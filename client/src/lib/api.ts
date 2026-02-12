import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const endpoint = (path?: string) => {
  if (!path) {
    throw new Error("API endpoint is undefined");
  }

  if (path.startsWith("/")) {
    throw new Error(`Endpoint must NOT start with '/': ${path}`);
  }

  return path;
};

export const primaryApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

primaryApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return primaryApi(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const registerStudent = (payload: any) =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_REGISTER_STUDENT),
    payload,
  );

export const registerProfessor = (payload: any) =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_REGISTER_PROFESSOR),
    payload,
  );

export const loginStudent = (payload: any) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_LOGIN_STUDENT), payload);

export const loginProfessor = (payload: any) =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_LOGIN_PROFESSOR),
    payload,
  );

export const getCurrentUser = () =>
  primaryApi.get(endpoint(process.env.NEXT_PUBLIC_API_ME));

export const logoutUser = () =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_LOGOUT));

export const refreshToken = () =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_REFRESH));

export const generateOtp = (phoneNumber: string) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_GENERATE_OTP), {
    phoneNumber,
  });

export const verifyOtp = (phoneNumber: string, code: string) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_VERIFY_OTP), {
    phoneNumber,
    code,
  });

export const sendEmailVerification = (email: string) =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_SEND_EMAIL_VERIFICATION),
    { email },
  );

export const verifyEmailToken = (token: string) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_VERIFY_EMAIL_TOKEN), {
    token,
  });

export const resendEmailVerification = () =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_RESEND_EMAIL_VERIFICATION),
  );

export const createProfile = async (payload: any) => {
  try {
    return await primaryApi.post(
      endpoint(process.env.NEXT_PUBLIC_API_SETUP_PROFILE),
      payload,
    );
  } catch (err: any) {
    if (err.response?.status === 409) {
      return await editProfile(payload);
    }
    throw err;
  }
};

export const editProfile = (payload: any) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_EDIT_PROFILE), payload);

export const getProfile = () =>
  primaryApi.get(endpoint(process.env.NEXT_PUBLIC_API_GET_PROFILE));

export const addDocuments = (formData: FormData) =>
  primaryApi.post(endpoint(process.env.NEXT_PUBLIC_API_ADD_DOCS), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDocuments = () =>
  primaryApi.get(endpoint(process.env.NEXT_PUBLIC_API_GET_DOCS));

export async function analyzeFrame(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const success = Math.random() > 0.1;
  if (success) {
    return { status: "ok", message: "Frame analyzed successfully" };
  } else {
    throw new Error("Mock AI proctoring failed");
  }
}

export const uploadPreExam = (payload: any) =>
  primaryApi.post(
    endpoint(process.env.NEXT_PUBLIC_API_UPLOAD_PRE_EXAM),
    payload,
  );
