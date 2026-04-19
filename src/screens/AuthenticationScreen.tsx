import BasicLayout from "../components/BasicLayout";
import { useState } from "react";
import { SignUpForm } from "../components/organisms/forms/auth/SignUpForm";
import { SignInForm } from "../components/organisms/forms/auth/SignInForm";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const AuthenticationScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <BasicLayout>
      <Heading size="2xl" className="text-left text-primary-500 mt-3 mb-3">
        {isSignUp ? "Sign Up" : "Sign In"}
      </Heading>
      {isSignUp ? <SignUpForm /> : <SignInForm />}
      <Button
        size="md"
        variant="link"
        className="gap-0"
        onPress={() => setIsSignUp((prev) => !prev)}
      >
        <Text>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
        </Text>
        <ButtonText>{isSignUp ? "Sign in." : "Sign up."}</ButtonText>
      </Button>
    </BasicLayout>
  );
};

export default AuthenticationScreen;
