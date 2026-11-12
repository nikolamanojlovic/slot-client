import type { Participant } from "../api/messages";

export const participantName = (p: Participant): string =>
  [p.firstName, p.lastName].filter(Boolean).join(" ") || "Unknown user";
