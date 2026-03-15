import { View } from "react-native";
import BasicLayout from "../components/BasicLayout";
import { useState } from "react";
import { SignUpForm } from "../components/organisms/forms/auth/SignUpForm";
import { SignInForm } from "../components/organisms/forms/auth/SignInForm";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const AuthenticationScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <BasicLayout>
      <Heading size="2xl" className="text-left underline mt-3 mb-3">
        {isSignUp ? "Sign Up" : "Sign In"}
      </Heading>
      {isSignUp ? <SignUpForm /> : <SignInForm />}
      <Button
        size="md"
        variant="link"
        onPress={() => setIsSignUp((prev) => !prev)}
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
    </BasicLayout>
  );
};

export default AuthenticationScreen;
