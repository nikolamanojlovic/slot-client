export type DateTimeType = "date" | "time" | "datetime";

export const CURRENT_YEAR = new Date().getFullYear();

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Mon-first 3-char labels — index with (getDay() + 6) % 7
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 3-char month labels (getMonth() index)
export const MONTH_SHORT_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Derived 3-char labels keyed by backend enum value
const DAY_SHORT_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_OF_WEEK_LABELS: Record<string, string> = Object.fromEntries(
  DAYS_OF_WEEK.map((d, i) => [d, DAY_SHORT_NAMES[i]]),
);

export const getMondayDateOfCurrentWeek = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const formatDate = (date: Date): string =>
  `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;

export const formatDateISO = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatTime = (date: Date): string =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatDatetime = (date: Date): string =>
  `${formatDate(date)} ${formatTime(date)}`;

export const formatByMode = (date: Date, mode: DateTimeType): string => {
  if (mode === "date") return formatDate(date);
  if (mode === "time") return formatTime(date);
  return formatDatetime(date);
};
