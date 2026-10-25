const TZ = "Africa/Lagos";
const HOUR_MS = 60 * 60 * 1000;

// Today's date in Lagos as YYYY-MM-DD
export const getLagosToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// Tomorrow's date in Lagos as YYYY-MM-DD (the earliest date a client can book)
export const getLagosTomorrow = () => {
  const date = new Date(`${getLagosToday()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

export const formatLagosTime = (iso) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));

export const formatLagosDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export const getLagosDateParts = (iso) => {
  const date = new Date(iso);
  const part = (options) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...options }).format(date);

  return {
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
    weekday: part({ weekday: "long" }),
  };
};

// Clients can cancel until the end of the day before the session, in Lagos time.
// That means the deadline is midnight (00:00 Lagos) at the start of the session's day.
export const getCancelDeadline = (startAt) => {
  const lagosClock = new Date(new Date(startAt).getTime() + HOUR_MS);
  return (
    Date.UTC(lagosClock.getUTCFullYear(), lagosClock.getUTCMonth(), lagosClock.getUTCDate()) -
    HOUR_MS
  );
};

export const canStillCancel = (startAt) => Date.now() < getCancelDeadline(startAt);

// Current hour (0-23) in Lagos
export const getLagosHour = () =>
  Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(
      new Date()
    )
  );

// The Lagos calendar date of a timestamp, as YYYY-MM-DD
export const toLagosDateString = (iso) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));

// Builds a timestamp from a Lagos date and hour (Lagos is always UTC+1)
export const toLagosIso = (date, hour) => `${date}T${String(hour).padStart(2, "0")}:00:00+01:00`;

// Midnight at the start of a Lagos date, as a UTC timestamp for the API
export const lagosDayStartUtc = (date) => new Date(toLagosIso(date, 0)).toISOString();

// Adds days to a YYYY-MM-DD date string
export const addDaysToDateString = (date, days) => {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
};

// Writes a UTC slot time in the "+01:00" form used in the API's booking example
export const toLagosOffsetIso = (iso) => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(
      new Date(iso)
    )
  );
  return toLagosIso(toLagosDateString(iso), hour);
};