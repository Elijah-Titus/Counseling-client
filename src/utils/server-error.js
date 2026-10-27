import { getErrorMessage } from "../api/axios";

// The backend's field messages when it sends them, otherwise its main message
export const getServerError = (err, fallback) => {
  const fields = err.response?.data?.errors;
  const messages =
    fields && typeof fields === "object" && !Array.isArray(fields)
      ? Object.values(fields)
          .flat()
          .filter((message) => typeof message === "string")
      : [];

  return messages.length > 0 ? messages.join(" ") : getErrorMessage(err, fallback);
};