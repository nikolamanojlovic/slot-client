import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { colors } from "@/src/constants/colors";
import { Price } from "@/src/types/api/expertise/expertise.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expertiseName: string;
  tenantName: string;
  professionalName: string | null;
  duration: number;
  price: Price | null;
}

const Divider = () => (
  <View style={{ height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 }} />
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    }}
  >
    <Text style={{ fontSize: 14, color: "#888" }}>{label}</Text>
    <Text style={{ fontSize: 14, color: "#333", fontWeight: "500" }}>
      {value}
    </Text>
  </View>
);

const SchedulingProgressOverviewActionSheet = ({
  isOpen,
  onClose,
  expertiseName,
  tenantName,
  professionalName,
  duration,
  price,
}: Props) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ minHeight: 260 }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View
          style={{
            width: "100%",
            paddingHorizontal: 4,
            paddingBottom: 24,
            paddingTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Overview
          </Text>

          <Row label="Tenant" value={tenantName} />
          <Row label="Expertise" value={expertiseName} />
          <Row label="Duration" value={`${duration} min`} />
          {price && (
            <Row label="Price" value={`${price.amount} ${price.currency}`} />
          )}

          <Divider />

          <Row label="Provider" value={professionalName ?? tenantName} />
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default SchedulingProgressOverviewActionSheet;
