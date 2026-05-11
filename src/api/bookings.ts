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
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export const createBooking = async (body: CreateBookingRequest): Promise<string> => {
  const { data } = await api.post<string>("/bookings", body);
  return data;
};

export const getBooking = async (id: string): Promise<BookingResponse> => {
  const { data } = await api.get<BookingResponse>(`/bookings/${id}`);
  return data;
};
