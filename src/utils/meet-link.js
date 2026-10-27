export const MEET_LINK_MAX = 200;

// Returns an error message, or "" when the link is valid.
export const validateMeetLink = (value) => {
  const text = (value || "").trim();

  if (!text) return "Enter your Google Meet link.";
  if (text.length > MEET_LINK_MAX) {
    return `The link must be ${MEET_LINK_MAX} characters or fewer.`;
  }

  let url;
  try {
    url = new URL(text);
  } catch {
    return "That doesn't look like a valid link.";
  }

  if (url.protocol !== "https:") return "The link must start with https://";

  // Look at the raw text before "/" "?" or "#" to catch credentials and ports
  const authority = text.slice(8).split(/[/?#]/)[0];
  if (authority.includes("@")) return "The link can't contain a username or password.";
  if (authority.includes(":")) return "The link can't contain a port number.";

  if (url.hostname !== "meet.google.com") {
    return "Only meet.google.com links are allowed.";
  }
  if (url.pathname === "/" || url.pathname === "") {
    return "Add the meeting code after meet.google.com/ (for example abc-defg-hij).";
  }
  return "";
};

// Same room = same host + path, ignoring case, query (?authuser=0), hash and trailing slash
export const normalizeMeetLink = (value) => {
  try {
    const url = new URL((value || "").trim());
    return `${url.hostname}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return "";
  }
};