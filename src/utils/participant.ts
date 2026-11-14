import type { Participant } from "../api/messages";

export const participantName = (p: Participant, fallback = "Unknown user"): string =>
  [p.firstName, p.lastName].filter(Boolean).join(" ") || fallback;
