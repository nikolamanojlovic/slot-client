import BasicNavigationLayout from "../components/BasicNavigationLayout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const ProfessionalAnalyticsScreen = () => {
  return (
    <BasicNavigationLayout title="Analytics" showBack={true}>
      <VStack className="flex-1 items-center justify-center">
        <Text>Analytics coming soon</Text>
      </VStack>
    </BasicNavigationLayout>
  );
};

export default ProfessionalAnalyticsScreen;
