import z from "zod";

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "Too short")
  .max(30, "Too long");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Too short")
  .max(30, "Too long");

export const roleSchema = z.enum(["student", "professor"]);

export const mobileSchema = z
  .string()
  .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits");

export const walletSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address");

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email");

export const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/\d/, "Must contain at least one digit")
  .regex(/[@$!%*?&#]/, "Must contain at least one special char");

export const newUser = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  mobileNumber: mobileSchema,
  role: roleSchema,
  email: emailSchema,
  password: passwordSchema,
  walletAddress: walletSchema,
});

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  mobileNumber: mobileSchema,
  role: roleSchema,
  email: emailSchema,
  password: z.string(),
  walletAddress: walletSchema,
  isVerified: z.boolean().default(false),
  refreshToken: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Profile validation
const base = z.object({
  universityName: z.string().trim(),
  collegeName: z.string().trim(),
});

const studentProfile = z.object({
  role: z.literal("student"),
  majorName: z.string().trim(),
  currentSem: z.string().trim(),
  startYear: z.string().regex(/^\d{4}$/),
  gradYear: z.string().regex(/^\d{4}$/),
});

const professorProfile = z.object({
  role: z.literal("professor"),
  department: z.string().trim(),
  designation: z.string().trim(),
  employmentType: z.enum(["full-time", "contract", "visiting"]),
  joiningYear: z.string().regex(/^\d{4}$/),
});

export const setupProfileSchema = z.discriminatedUnion("role", [
  studentProfile.merge(base),
  professorProfile.merge(base),
]);
