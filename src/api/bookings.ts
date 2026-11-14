import api from "../lib/axios";
import type { Page, Participant } from "./messages";

export interface CreateBookingRequest {
  tenantId: string;
  expertiseId: string;
  professionalExternalId: string;
  date: string;
  startTime: string;
  endTime: string;
}

// The booking lifecycle (scheduling-service). A reschedule keeps it CONFIRMED
export type BookingState =
  | "PENDING"
  | "CONFIRMED"
  | "DECLINED"
  | "CANCELLED"
  | "NEEDS_RESCHEDULING"
  | "NO_SHOW";

export interface BookingResponse {
  id: string;
  professionalExternalId: string;
  clientExternalId: string | null;
  expertiseExternalId: string;
  // Null on bookings made before scheduling-service stored it
  expertiseName: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingState;
  declineReason: string | null;
  cancelReason: string | null;
  // Reason of the latest reschedule
  rescheduleReason: string | null;
}

// A row of getBookings: the booking and the other side of it (the client for a
// professional, the professional for a client)
export interface UserBookingResponse {
  booking: BookingResponse;
  otherParticipant: Participant;
}

export interface GetBookingsParams {
  from?: string; // yyyy-MM-dd, local; the server's default is its own (UTC) today
  to?: string; // yyyy-MM-dd, local; defaults to from, 400 booking.date.range.invalid if before it
  state?: BookingState[]; // every state when missing
  page?: number;
  size?: number;
}

// The caller's bookings in either role, ordered by date then start time
export const getBookings = async ({
  from,
  to,
  state,
  page = 0,
  size = 10,
}: GetBookingsParams = {}): Promise<Page<UserBookingResponse>> => {
  const { data } = await api.get<Page<UserBookingResponse>>("/bookings", {
    // Comma-joined: the server doesn't read axios's default state[]=
    params: { from, to, state: state?.join(","), page, size },
  });
  return data;
};

export const createBooking = async (body: CreateBookingRequest): Promise<string> => {
  const { data } = await api.post<string>("/bookings", body);
  return data;
};

export const getBooking = async (id: string): Promise<BookingResponse> => {
  const { data } = await api.get<BookingResponse>(`/bookings/${id}`);
  return data;
};

// Only the booked professional; 409 booking.status.invalid once already answered
export const confirmBooking = async (id: string): Promise<BookingResponse> => {
  const { data } = await api.post<BookingResponse>(`/bookings/${id}/confirm`);
  return data;
};

export const declineBooking = async (
  id: string,
  reason?: string,
): Promise<BookingResponse> => {
  const { data } = await api.post<BookingResponse>(
    `/bookings/${id}/decline`,
    reason ? { reason } : undefined,
  );
  return data;
};

// Only the booked professional, only a confirmed booking; reason is required.
// 409 booking.status.invalid when it isn't confirmed (anymore)
export const cancelBooking = async (
  id: string,
  reason: string,
): Promise<BookingResponse> => {
  const { data } = await api.post<BookingResponse>(`/bookings/${id}/cancel`, { reason });
  return data;
};

export interface RescheduleBookingRequest {
  date: string; // yyyy-MM-dd, today or later
  startTime: string; // HH:mm
  endTime: string; // HH:mm, same duration as the booking
  reason?: string;
}

// Only the booked professional, only a confirmed booking. It stays CONFIRMED,
// the client doesn't accept it. 409 booked.slot.capacity.exceeded when the new
// slot is full, 400 booking.reschedule.invalid for the same time or another duration
export const rescheduleBooking = async (
  id: string,
  body: RescheduleBookingRequest,
): Promise<BookingResponse> => {
  const { data } = await api.post<BookingResponse>(`/bookings/${id}/reschedule`, body);
  return data;
};
