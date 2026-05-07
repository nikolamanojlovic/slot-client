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
  tenantType: TenantType;
  expertise: Expertise;
  professionalId: string | null;
  selectedDate: string | null;
  selectedSlot: SlotOption | null;
  setProfessionalId: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: SlotOption | null) => void;
}

const SchedulingContext = createContext<SchedulingState | null>(null);

interface SchedulingProviderProps {
  tenantId: string;
  tenantType: TenantType;
  expertise: Expertise;
  children: React.ReactNode;
}

export const SchedulingProvider = ({
  tenantId,
  tenantType,
  expertise,
  children,
}: SchedulingProviderProps) => {
  const [professionalId, setProfessionalId] = useState<string | null>(
    tenantType === TenantType.INDIVIDUAL ? (expertise.professionals[0] ?? null) : null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotOption | null>(null);

  return (
    <SchedulingContext.Provider
      value={{
        tenantId,
        tenantType,
        expertise,
        professionalId,
        selectedDate,
        selectedSlot,
        setProfessionalId,
        setSelectedDate,
        setSelectedSlot,
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
