import { View } from "react-native";
import NavigationBar from "./organisms/navigation/NavigationBar";

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1">
      <View className="flex-1 pr-3 pl-3">{children}</View>
      <NavigationBar />
    </View>
  );
};

export default BasicLayout;
