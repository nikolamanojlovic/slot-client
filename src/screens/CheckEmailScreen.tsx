import BasicLayout from "../components/BasicLayout";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { MailQuestion } from "lucide-react";

const CheckEmailScreen = () => {
  return (
    <BasicLayout>
      <VStack className="flex-1 justify-center items-center gap-4">
        {/* @ts-ignore */}
        <Icon as={MailQuestion} color="#06392F" size={50} />
        <Heading size="2xl" className="text-center text-primary-500">
          Check email
        </Heading>
        <Text className="text-center text-gray-500">
          Activate your account by clicking the link from the inbox.
        </Text>
      </VStack>
    </BasicLayout>
  );
};

export default CheckEmailScreen;
