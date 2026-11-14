import type { BookingData } from "../api/messages";

export interface BookingViewer {
  // The reader is the professional: the other participant is the client
  isProfessional: boolean;
  otherName: string;
}

// Names and the expertise are bold in the booking card
export interface TextPart {
  text: string;
  bold?: boolean;
}

const b = (text: string): TextPart => ({ text, bold: true });
const t = (text: string): TextPart => ({ text });

// A BOOKING message as a sentence for whoever is reading it. Built here rather
// than stored, because the wording depends on the reader and names come from
// user-service at read time. Who acted follows from the status: the client
// requests, the professional confirms, declines, cancels or reschedules. No date, time or
// reason: the booking card shows those on their own lines. Returns null for a
// status this client doesn't know.
export const bookingMessageParts = (
  data: BookingData,
  { isProfessional, otherName }: BookingViewer,
): TextPart[] | null => {
  const name = b(otherName);
  const what = data.expertiseName ? b(data.expertiseName) : t("a session");
  const forWhat = data.expertiseName ? [t(" for "), b(data.expertiseName)] : [];

  if (isProfessional) {
    switch (data.status) {
      case "REQUESTED":
        return [name, t(" wants to book "), what, t(". Confirm or decline the request.")];
      case "CONFIRMED":
        return [t("You confirmed "), name, t("'s booking"), ...forWhat, t(".")];
      case "DECLINED":
        return [t("You declined "), name, t("'s booking"), ...forWhat, t(".")];
      case "CANCELLED":
        return [t("You cancelled "), name, t("'s booking"), ...forWhat, t(".")];
      case "RESCHEDULED":
        return [t("You moved "), name, t("'s booking"), ...forWhat, t(".")];
    }
  }

  switch (data.status) {
    case "REQUESTED":
      return [
        t("You requested to book "),
        what,
        t(" with "),
        name,
        t(". Waiting for "),
        name,
        t(" to confirm."),
      ];
    case "CONFIRMED":
      return [name, t(" confirmed your booking"), ...forWhat, t(".")];
    case "DECLINED":
      return [name, t(" declined your booking"), ...forWhat, t(".")];
    case "CANCELLED":
      return [name, t(" cancelled your booking"), ...forWhat, t(".")];
    case "RESCHEDULED":
      return [name, t(" moved your booking"), ...forWhat, t(".")];
  }
  return null;
};

// Plain-text version with the decline/cancel reason, e.g. the inbox preview
export const bookingMessageText = (
  data: BookingData,
  viewer: BookingViewer,
): string | null => {
  const parts = bookingMessageParts(data, viewer);
  if (!parts) return null;
  const reason = data.reason ? ` Reason: ${data.reason}` : "";
  return parts.map((p) => p.text).join("") + reason;
};
