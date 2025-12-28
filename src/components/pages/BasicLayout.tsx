import { View } from "react-native";
import NavigationBar from "../organisms/navigation/NavigationBar";

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1">
      {children}
      <NavigationBar />
    </View>
  );
};

export default BasicLayout;
