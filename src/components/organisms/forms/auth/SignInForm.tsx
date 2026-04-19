import { useState } from "react";
import { useAuth } from "../../../../queries/useAuth";
import { TextInputChangeEvent } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation/navigation.type";
import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export const SignInForm = () => {
  const { signIn, signInError, isSigningIn } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChangeText = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    signIn(
      { email: form.email, password: form.password },
      { onSuccess: () => navigation.navigate("home") },
    );
  };

  return (
    <VStack className="w-full">
      <FormControl size="md" isInvalid={!!errors.email}>
        <Box className="mb-3">
          <FormControlLabelText className="mb-2">Email</FormControlLabelText>
          <Input className="w-full" size="md">
            <InputField
              value={form.email}
              onChange={(val: TextInputChangeEvent) =>
                handleChangeText("email", val.nativeEvent.text)
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Input>
          {!!errors.email && (
            <FormControlError>
              <FormControlErrorText>{errors.email}</FormControlErrorText>
            </FormControlError>
          )}
        </Box>
      </FormControl>
      <FormControl size="md" isInvalid={!!errors.password}>
        <Box className="mb-5">
          <FormControlLabelText className="mb-2">Password</FormControlLabelText>
          <Input className="w-full" size="md">
            <InputField
              value={form.password}
              type="password"
              onChange={(val: TextInputChangeEvent) =>
                handleChangeText("password", val.nativeEvent.text)
              }
              autoCorrect={false}
            />
          </Input>
          {!!errors.password && (
            <FormControlError>
              <FormControlErrorText>{errors.password}</FormControlErrorText>
            </FormControlError>
          )}
        </Box>
      </FormControl>
      {!!signInError && (
        <Text className="text-error-600 text-sm mb-3">
          {(signInError as any)?.message ?? "Sign in failed. Please try again."}
        </Text>
      )}
      <Button
        className="w-full"
        onPress={handleSubmit}
        isDisabled={isSigningIn}
      >
        <ButtonText>{isSigningIn ? "Signing in..." : "Sign In"}</ButtonText>
      </Button>
    </VStack>
  );
};
