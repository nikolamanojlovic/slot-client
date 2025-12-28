import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

interface AnonymousHeaderProps {
  setIsAuthSheetOpen: (open: boolean) => void;
}

const AnonymousHeader = ({ setIsAuthSheetOpen }: AnonymousHeaderProps) => {
  return (
    <HStack className="w-full align-items-center justify-end p-3">
      <Button
        size="md"
        variant="solid"
        onPress={() => setIsAuthSheetOpen(true)}
      >
        <ButtonText>Sign In</ButtonText>
      </Button>
    </HStack>
  );
};

export default AnonymousHeader;
