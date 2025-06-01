import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  //you can pass client configuration here
  plugins: [
    oneTapClient({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        // Any extra options for the Google initialize method
      },
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 1000, // Base delay in ms (default: 1000)
        maxAttempts: 5, // Maximum number of attempts before triggering onPromptNotification (default: 5)
      },
    }),
  ],
});
