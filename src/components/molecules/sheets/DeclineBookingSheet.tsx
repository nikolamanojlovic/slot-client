import { useState } from "react";
import { View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";

const MAX_REASON_LENGTH = 500;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // reason is undefined when left blank
  onDecline: (reason?: string) => void;
}

const DeclineBookingSheet = ({ isOpen, onClose, onDecline }: Props) => {
  const [reason, setReason] = useState("");

  const close = () => {
    setReason("");
    onClose();
  };

  const submit = () => {
    onDecline(reason.trim() || undefined);
    setReason("");
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={close}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View style={{ width: "100%", gap: 12, paddingTop: 8, paddingBottom: 24 }}>
          <Text className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>
            Decline booking
          </Text>
          <Input size="md" style={{ borderColor: colors.borderStrong, height: 96 }}>
            <InputField
              placeholder="Reason (optional)"
              value={reason}
              onChangeText={setReason}
              maxLength={MAX_REASON_LENGTH}
              multiline
              textAlignVertical="top"
            />
          </Input>
          <HStack space="sm">
            <Button
              variant="outline"
              className="flex-1"
              style={{ borderColor: colors.borderStrong }}
              onPress={close}
            >
              <ButtonText style={{ color: colors.textSecondary }}>Cancel</ButtonText>
            </Button>
            <Button
              className="flex-1"
              style={{ backgroundColor: colors.error }}
              onPress={submit}
            >
              <ButtonText style={{ color: colors.white }}>Decline</ButtonText>
            </Button>
          </HStack>
        </View>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default DeclineBookingSheet;
