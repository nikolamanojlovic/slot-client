import { SignInForm } from "./SignInForm";
import { useEffect, useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import { Text } from "@/components/ui/text";

interface AuthActionSheetProps {
  isAuthSheetOpen: boolean;
  setIsAuthSheetOpen: (open: boolean) => void;
}

export const AuthActionSheet = ({
  isAuthSheetOpen,
  setIsAuthSheetOpen,
}: AuthActionSheetProps) => {
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!isAuthSheetOpen) {
      setIsSignUp(false);
    }
  }, [isAuthSheetOpen]);

  return (
    <Actionsheet
      isOpen={isAuthSheetOpen}
      onClose={() => setIsAuthSheetOpen(false)}
    >
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetItem>
          <Heading size="2xl" className="mb-0">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Heading>
        </ActionsheetItem>
        <ActionsheetItem>
          {isSignUp ? <SignUpForm /> : <SignInForm />}
        </ActionsheetItem>
        <ActionsheetItem>
          <Button
            size="md"
            variant="link"
            onPress={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? (
              <Text>
                Already have an account? <u>Sign in.</u>
              </Text>
            ) : (
              <Text>
                Don't have an account? <u>Sign up.</u>
              </Text>
            )}
          </Button>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};
