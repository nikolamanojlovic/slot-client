import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common/error.interface";
import {
  confirmBooking,
  declineBooking,
  type BookingResponse,
} from "../api/bookings";
import type { BookingStatus } from "../api/messages";

export const useConfirmBooking = () =>
  useMutation<BookingResponse, AxiosError<ErrorResponse>, string>({
    mutationFn: confirmBooking,
  });

export const useDeclineBooking = () =>
  useMutation<
    BookingResponse,
    AxiosError<ErrorResponse>,
    { bookingId: string; reason?: string }
  >({
    mutationFn: ({ bookingId, reason }) => declineBooking(bookingId, reason),
  });

// scheduling-service statuses → the status a BOOKING message shows
export const toMessageBookingStatus = (
  status: BookingResponse["status"],
): BookingStatus | null => {
  switch (status) {
    case "PENDING":
      return "REQUESTED";
    case "CONFIRMED":
      return "CONFIRMED";
    case "DECLINED":
      return "DECLINED";
    default:
      return null;
  }
};
