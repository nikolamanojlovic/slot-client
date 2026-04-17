import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const CheckEmailScreen = () => {
  return (
    <BasicLayout>
      <VStack className="flex-1 justify-center items-center">
        <Heading size="2xl" className="text-center mb-4">
          Check your email
        </Heading>
        <Text className="text-center text-gray-500">
          We sent you a confirmation link. Please check your inbox and click the
          link to activate your account.
        </Text>
      </VStack>
    </BasicLayout>
  );
};

export default CheckEmailScreen;
