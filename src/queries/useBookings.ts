import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common/error.interface";
import { queryClient } from "../lib/query";
import {
  cancelBooking,
  confirmBooking,
  declineBooking,
  getBookings,
  rescheduleBooking,
  type BookingResponse,
  type GetBookingsParams,
  type RescheduleBookingRequest,
} from "../api/bookings";
import type { BookingFlowState } from "../api/messages";

// The bookings list reads scheduling-service directly, so any action changes it
const invalidateBookings = () =>
  queryClient.invalidateQueries({ queryKey: ["bookings"] });

export const useBookings = (params: GetBookingsParams) =>
  useQuery({
    queryKey: [
      "bookings",
      params.from,
      params.to,
      params.state?.join(","),
      params.page,
      params.size,
    ],
    queryFn: () => getBookings(params),
  });

export const useConfirmBooking = () =>
  useMutation<BookingResponse, AxiosError<ErrorResponse>, string>({
    mutationFn: confirmBooking,
    onSuccess: invalidateBookings,
  });

export const useDeclineBooking = () =>
  useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    { bookingId: string; reason?: string }
  >({
    mutationFn: ({ bookingId, reason }) => declineBooking(bookingId, reason),
    onSuccess: invalidateBookings,
  });

export const useCancelBooking = () =>
  useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    { bookingId: string; reason: string }
  >({
    mutationFn: ({ bookingId, reason }) => cancelBooking(bookingId, reason),
    onSuccess: invalidateBookings,
  });

export const useRescheduleBooking = () =>
  useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    { bookingId: string } & RescheduleBookingRequest
  >({
    mutationFn: ({ bookingId, ...body }) => rescheduleBooking(bookingId, body),
    onSuccess: invalidateBookings,
  });

// A booking's state after confirm/decline/cancel → the flow state its new card shows
export const toBookingFlowState = (
  status: BookingResponse["status"],
): BookingFlowState | null => {
  switch (status) {
    case "PENDING":
      return "REQUESTED";
    case "CONFIRMED":
      return "CONFIRMED";
    case "DECLINED":
      return "DECLINED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return null;
  }
};
