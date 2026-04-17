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
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";

export const SignInForm = () => {
  const { signIn } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChangeText = (
    key: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    signIn(
      { email: form.email, password: form.password },
      { onSuccess: () => navigation.navigate("home") }
    );
  };

  return (
    <VStack className="w-full">
      <FormControl size="md">
        <Box className="mb-3">
          <FormControlLabelText className="mb-2">Email</FormControlLabelText>
          <Input className="w-full" size="md">
            <InputField
              id="sign-up-email"
              value={form.email}
              onChange={(val: TextInputChangeEvent) =>
                handleChangeText("email", val.nativeEvent.text)
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Input>
        </Box>
        <Box className="mb-5">
          <FormControlLabelText className="mb-2">Password</FormControlLabelText>
          <Input className="w-full" size="md">
            <InputField
              id="sign-up-password"
              value={form.password}
              type="password"
              onChange={(val: TextInputChangeEvent) =>
                handleChangeText("password", val.nativeEvent.text)
              }
              autoCorrect={false}
            />
          </Input>
        </Box>
      </FormControl>
      <Button className="w-full" onPress={handleSubmit}>
        <ButtonText>Sign In</ButtonText>
      </Button>
    </VStack>
  );
};
