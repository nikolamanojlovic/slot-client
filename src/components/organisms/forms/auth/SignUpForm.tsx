import { useState } from "react";
import { useAuth } from "../../../../queries/useAuth";
import { UserRole } from "../../../../types/api/user/user.enum";
import { TextInputChangeEvent } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation/navigation.type";
import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Box } from "@/components/ui/box";
import { CheckIcon } from "lucide-react";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Button, ButtonText } from "@/components/ui/button";
import { colors } from "@/src/constants/colors";

export const SignUpForm = () => {
  const { signUp } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isProfessional: false,
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
    if (form.password !== form.confirmPassword) {
      return;
    }

    signUp(
      {
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.isProfessional ? UserRole.PROFESSIONAL : UserRole.CLIENT,
      },
      {
        onSuccess: () => navigation.navigate("checkEmail"),
      }
    );
  };

  return (
    <VStack className="w-full">
      <FormControl size="md">
        <HStack className="w-full gap-2 mb-3">
          <VStack className="flex-1">
            <FormControlLabelText className="mb-2 font-semibold text-xs" style={{ color: colors.primary }}>
              First name
            </FormControlLabelText>
            <Input className="w-full" size="md">
              <InputField
                id="sign-up-first-name"
                value={form.firstName}
                onChange={(val: TextInputChangeEvent) =>
                  handleChangeText("firstName", val.nativeEvent.text)
                }
              />
            </Input>
          </VStack>
          <VStack className="flex-1">
            <FormControlLabelText className="mb-2 font-semibold text-xs" style={{ color: colors.primary }}>
              Last name
            </FormControlLabelText>
            <Input className="w-full" size="md">
              <InputField
                id="sign-up-last-name"
                value={form.lastName}
                onChange={(val: TextInputChangeEvent) =>
                  handleChangeText("lastName", val.nativeEvent.text)
                }
              />
            </Input>
          </VStack>
        </HStack>
        <Box className="mb-3">
          <FormControlLabelText className="mb-2 font-semibold text-xs" style={{ color: colors.primary }}>Email</FormControlLabelText>
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
        <Box className="mb-3">
          <FormControlLabelText className="mb-2 font-semibold text-xs" style={{ color: colors.primary }}>Password</FormControlLabelText>
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
        <Box className="mb-3">
          <FormControlLabelText className="mb-2 font-semibold text-xs" style={{ color: colors.primary }}>
            Confirm password
          </FormControlLabelText>
          <Input className="w-full" size="md">
            <InputField
              id="sign-up-confirm-password"
              value={form.confirmPassword}
              type="password"
              onChange={(val: TextInputChangeEvent) =>
                handleChangeText("confirmPassword", val.nativeEvent.text)
              }
              autoCorrect={false}
            />
          </Input>
        </Box>
        <HStack className="mt-2 mb-5">
          <Checkbox
            id="sign-up-is-professional"
            value="sign-up-is-professional"
            isChecked={form.isProfessional}
            // @ts-ignore
            onChange={(val) => handleChangeText("isProfessional", val)}
            size="md"
          >
            <CheckboxIndicator className="text-white">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              I want to sign up as a <u>professional</u>
            </CheckboxLabel>
          </Checkbox>
        </HStack>
      </FormControl>
      <Button className="w-full" onPress={handleSubmit}>
        <ButtonText>Sign Up</ButtonText>
      </Button>
    </VStack>
  );
};
