import { Storage } from "@google-cloud/storage";

const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT;

if (!serviceAccount) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT environment variable not set");
}

const credentials = JSON.parse(serviceAccount);
export const storage = new Storage({
  credentials,
});
