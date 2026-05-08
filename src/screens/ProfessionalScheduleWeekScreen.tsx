import { useRef, useState } from "react";
import { Pressable } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/types/navigation/navigation.type";
import BasicNavigationLayout from "@/src/components/BasicNavigationLayout";
import EditRemoveActionSheet from "@/src/components/molecules/sheets/EditRemoveActionSheet";
import { Icon } from "@/components/ui/icon";
import { EllipsisVertical } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { VStack } from "@/components/ui/vstack";
import ProfessionalScheduleWeekTimetableShortcuts from "@/src/components/molecules/ProfessionalScheduleWeekTimetableShortcuts";
import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import ProfessionalScheduleWeekTimetableTemplate, {
  TimetableHandle,
} from "@/src/components/molecules/ProfessionalScheduleWeekTimetableTemplate";
import {
  deleteScheduleTemplateWeek,
  updateScheduleTemplateWeek,
} from "@/src/api/scheduleTemplates";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";
import { useSuccessToast } from "@/src/hooks/useSuccessToast";
import { useErrorToast } from "@/src/hooks/useErrorToast";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";

type Route = RouteProp<RootStackParamList, "professional-schedule-week">;

const ProfessionalScheduleWeekScreen = () => {
  const { params } = useRoute<Route>();
  const { week, templateId } = params;
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const timetableRef = useRef<TimetableHandle>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess } = useSuccessToast();
  const { showError } = useErrorToast();

  const { mutate: removeWeek } = useMutation({
    mutationFn: () => deleteScheduleTemplateWeek(templateId, week.weekIndex),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["schedule-template"] });
      navigation.navigate("professional-schedule");
    },
  });

  const { mutate: saveWeek, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const body = timetableRef.current!.getWeekData();
      return updateScheduleTemplateWeek(templateId, week.weekIndex, body);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["schedule-template"] });
      timetableRef.current?.collapse();
      setIsEditing(false);
      showSuccess("Week schedule saved successfully.");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showError(error);
    },
  });

  return (
    <>
      <BasicNavigationLayout
        title={`Schedule - Week ${week.weekIndex + 1}`}
        showBack
        rightAction={
          <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={8}>
            <Icon
              as={EllipsisVertical}
              size="sm"
              style={{ color: colors.primary }}
            />
          </Pressable>
        }
      >
        <VStack className="mt-3 flex-1">
          <ProfessionalScheduleWeekTimetableShortcuts
            isDisabled={!isEditing}
            onSelect={(shortcut) =>
              timetableRef.current?.applyShortcut(shortcut)
            }
          />
          <Text
            className="font-semibold text-xs mb-4"
            style={{ color: colors.primary }}
          >
            Working hours
          </Text>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <ProfessionalScheduleWeekTimetableTemplate
              ref={timetableRef}
              days={week.days}
              breaks={week.breaks}
              isEditing={isEditing}
            />
          </ScrollView>
          {isEditing && (
            <Button
              className="mt-4 mb-3"
              style={{ backgroundColor: isSaving ? "#9ca3af" : colors.primary }}
              isDisabled={isSaving}
              onPress={() => saveWeek()}
            >
              <ButtonText>{isSaving ? "Saving…" : "Save"}</ButtonText>
            </Button>
          )}
        </VStack>
      </BasicNavigationLayout>

      <EditRemoveActionSheet
        isOpen={isMenuOpen}
        title="Options"
        onClose={() => setIsMenuOpen(false)}
        onEdit={() => {
          setIsEditing(true);
          setIsMenuOpen(false);
        }}
        onRemove={() => removeWeek()}
      />
    </>
  );
};

export default ProfessionalScheduleWeekScreen;
