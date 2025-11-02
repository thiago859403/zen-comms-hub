import { z } from "zod";

// Auth validations
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export const signupSchema = loginSchema.extend({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters"),
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be less than 200 characters"),
});

// Contact validations
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (use E.164 format)")
    .max(20, "Phone must be less than 20 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  tags: z
    .string()
    .max(500, "Tags must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

// Message validations
export const messageSchema = z.object({
  recipients: z
    .string()
    .trim()
    .min(1, "Recipients are required")
    .max(1000, "Recipients field is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Message content is required")
    .max(4096, "Message must be less than 4096 characters"),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

// Chatbot validations
export const chatbotSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

// Settings validations
export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .trim()
    .min(1, "API key is required")
    .max(500, "API key is too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "API key contains invalid characters"),
});

export const webhookSchema = z.object({
  webhookUrl: z
    .string()
    .trim()
    .url("Invalid webhook URL format")
    .max(2048, "URL is too long")
    .regex(/^https:\/\//, "Webhook URL must use HTTPS"),
  webhookSecret: z
    .string()
    .trim()
    .min(16, "Webhook secret must be at least 16 characters")
    .max(500, "Webhook secret is too long"),
});

export const whatsappCredentialsSchema = z.object({
  phoneNumberId: z
    .string()
    .trim()
    .min(1, "Phone Number ID is required")
    .max(100, "Phone Number ID is too long")
    .regex(/^[0-9]+$/, "Phone Number ID must contain only numbers"),
  businessAccountId: z
    .string()
    .trim()
    .min(1, "Business Account ID is required")
    .max(100, "Business Account ID is too long")
    .regex(/^[0-9]+$/, "Business Account ID must contain only numbers"),
});
