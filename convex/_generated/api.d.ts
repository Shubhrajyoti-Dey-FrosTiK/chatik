/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as betterAuth from "../betterAuth.js";
import type * as chats from "../chats.js";
import type * as messages from "../messages.js";
import type * as schema_account from "../schema/account.js";
import type * as schema_chats from "../schema/chats.js";
import type * as schema_message from "../schema/message.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  betterAuth: typeof betterAuth;
  chats: typeof chats;
  messages: typeof messages;
  "schema/account": typeof schema_account;
  "schema/chats": typeof schema_chats;
  "schema/message": typeof schema_message;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
