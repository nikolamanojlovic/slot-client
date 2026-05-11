import { createContext, useContext, useState } from "react";
import { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { TenantType } from "@/src/types/api/tenant/tenant.interface";

export interface SlotOption {
  id: string;
  startTime: string;
  endTime: string;
}

interface SchedulingState {
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  expertise: Expertise;
  professionalId: string | null;
  professionalName: string | null;
  selectedDate: string | null;
  selectedSlot: SlotOption | null;
  bookingId: string | null;
  setProfessional: (id: string, name: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: SlotOption | null) => void;
  setBookingId: (id: string) => void;
}

const SchedulingContext = createContext<SchedulingState | null>(null);

interface SchedulingProviderProps {
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  expertise: Expertise;
  children: React.ReactNode;
}

export const SchedulingProvider = ({
  tenantId,
  tenantName,
  tenantType,
  expertise,
  children,
}: SchedulingProviderProps) => {
  const [professionalId, setProfessionalId] = useState<string | null>(
    tenantType === TenantType.INDIVIDUAL ? (expertise.professionals[0] ?? null) : null,
  );
  const [professionalName, setProfessionalName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotOption | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const setProfessional = (id: string, name: string) => {
    setProfessionalId(id);
    setProfessionalName(name);
  };

  return (
    <SchedulingContext.Provider
      value={{
        tenantId,
        tenantName,
        tenantType,
        expertise,
        professionalId,
        professionalName,
        selectedDate,
        selectedSlot,
        bookingId,
        setProfessional,
        setSelectedDate,
        setSelectedSlot,
        setBookingId,
      }}
    >
      {children}
    </SchedulingContext.Provider>
  );
};

export const useScheduling = (): SchedulingState => {
  const ctx = useContext(SchedulingContext);
  if (!ctx) throw new Error("useScheduling must be used inside SchedulingProvider");
  return ctx;
};
