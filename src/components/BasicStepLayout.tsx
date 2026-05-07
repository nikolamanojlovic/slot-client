import { View, Pressable } from "react-native";
import { H4 } from "@expo/html-elements";
import { ChevronLeft, X } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

interface Props {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  showBack?: boolean;
}

const BasicStepLayout = ({ title, children, onCancel, showBack = true }: Props) => {
  const navigation = useAppNavigation();

  return (
    <View className="flex-1">
      <View>
        <View className="flex-row items-center px-3 pt-2 pb-1">
          {showBack ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: 32,
                height: 32,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <ChevronLeft size={20} color={colors.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 32, height: 32 }} />
          )}
          <H4
            className="flex-1 text-center m-0 p-0"
            style={{ color: colors.primary }}
          >
            {title}
          </H4>
          <Pressable
            onPress={onCancel}
            style={{
              width: 32,
              height: 32,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <X size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>
      <View className="flex-1 pr-3 pl-3">{children}</View>
    </View>
  );
};

export default BasicStepLayout;
