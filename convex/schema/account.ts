import { v } from "convex/values";

export const AccountSchema = {
  accessToken: v.optional(v.string()),
  accessTokenExpiresAt: v.optional(v.string()),
  accountId: v.string(),
  idToken: v.optional(v.string()),
  password: v.optional(v.string()),
  providerId: v.string(),
  scope: v.optional(v.string()),
  updatedAt: v.string(),
  userId: v.id("user"),
};

export const SessionSchema = {
  expiresAt: v.string(),
  ipAddress: v.string(),
  token: v.string(),
  updatedAt: v.string(),
  userAgent: v.string(),
  userId: v.id("user"),
};

export const UserSchema = {
  email: v.string(),
  emailVerified: v.boolean(),
  name: v.string(),
  updatedAt: v.string(),
};
