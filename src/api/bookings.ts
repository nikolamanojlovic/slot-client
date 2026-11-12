import api from "../lib/axios";

export interface CreateBookingRequest {
  tenantId: string;
  expertiseId: string;
  professionalExternalId: string;
  date: string;
  startTime: string;
  endTime: string;
}

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
  status:
    | "PENDING"
    | "CONFIRMED"
    | "DECLINED"
    | "CANCELLED"
    | "NEEDS_RESCHEDULING"
    | "NO_SHOW";
  declineReason: string | null;
}

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
