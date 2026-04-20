import { Input, InputField } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Check, ChevronDown } from "lucide-react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createExpertise } from "@/src/api/expertise";
import { useCategoryTree } from "@/src/hooks/useCategoryTree";
import { ErrorResponse } from "@/src/types/common/error.interface";

interface ProfessionalCreateExpertiseFormProps {
  tenantId: string;
  professionalId: string;
  onClose: () => void;
  onError: (error: AxiosError<ErrorResponse>) => void;
}

const ProfessionalCreateExpertiseForm = ({
  tenantId,
  professionalId,
  onClose,
  onError,
}: ProfessionalCreateExpertiseFormProps) => {
  const queryClient = useQueryClient();
  const { superCategories } = useCategoryTree();

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    capacity: "",
    amount: "",
  });
  const [active, setActive] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSuperSheet, setShowSuperSheet] = useState(false);
  const [showSubSheet, setShowSubSheet] = useState(false);
  const [selectedSuperCategoryId, setSelectedSuperCategoryId] = useState<
    string | null
  >(null);

  const selectedSuper = superCategories.find(
    (sc) => sc.id === selectedSuperCategoryId,
  );
  const subcategories = selectedSuper?.subcategories ?? [];

  const selectedSubs = subcategories.filter((c) =>
    selectedCategories.includes(c.id),
  );
  const subLabel =
    selectedSubs.length === 0
      ? "Select subcategory"
      : selectedSubs.length === 1
        ? selectedSubs[0].name
        : `${selectedSubs[0].name} +${selectedSubs.length - 1}`;

  const mutation = useMutation({
    mutationFn: createExpertise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expertises/me"] });
      resetForm();
      onClose();
    },
    onError,
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      duration: "",
      capacity: "",
      amount: "",
    });
    setSelectedCategories([]);
    setSelectedSuperCategoryId(null);
  };

  const handleSubmit = () => {
    mutation.mutate({
      tenantId,
      name: form.name,
      description: form.description,
      duration: parseInt(form.duration, 10),
      capacity: parseInt(form.capacity, 10),
      categories: selectedCategories,
      professionals: [professionalId],
      amount: parseFloat(form.amount),
      active,
    });
  };

  const handleSelectSuper = (id: string) => {
    if (id !== selectedSuperCategoryId) {
      setSelectedSuperCategoryId(id);
      setSelectedCategories([]);
    }
    setShowSuperSheet(false);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <VStack space="md">
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Name</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="e.g. Hair & Beard"
            value={form.name}
            onChangeText={(v) => setForm((p) => ({ ...p, name: v }))}
          />
        </Input>
      </FormControl>

      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Description</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Optional description"
            value={form.description}
            onChangeText={(v) => setForm((p) => ({ ...p, description: v }))}
          />
        </Input>
      </FormControl>

      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Category</FormControlLabelText>
        </FormControlLabel>
        <Pressable
          onPress={() => setShowSuperSheet(true)}
          className="border border-background-300 rounded h-10 px-3 flex-row items-center justify-between"
        >
          <Text
            className={
              selectedSuperCategoryId
                ? "text-typography-900 flex-1 mr-2"
                : "text-typography-500 flex-1 mr-2"
            }
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectedSuper?.name ?? "Select category"}
          </Text>
          <Icon as={ChevronDown} size="sm" className="text-background-500" />
        </Pressable>
      </FormControl>

      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Subcategory</FormControlLabelText>
        </FormControlLabel>
        <Pressable
          onPress={() => selectedSuperCategoryId && setShowSubSheet(true)}
          className={`border border-background-300 rounded h-10 px-3 flex-row items-center justify-between ${
            !selectedSuperCategoryId ? "opacity-40" : ""
          }`}
        >
          <Text
            className={
              selectedCategories.length > 0
                ? "text-typography-900 flex-1 mr-2"
                : "text-typography-500 flex-1 mr-2"
            }
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subLabel}
          </Text>
          <Icon as={ChevronDown} size="sm" className="text-background-500" />
        </Pressable>
      </FormControl>

      <HStack space="md">
        <FormControl className="flex-1">
          <FormControlLabel>
            <FormControlLabelText>Duration (min)</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="45"
              keyboardType="numeric"
              value={form.duration}
              onChangeText={(v) => setForm((p) => ({ ...p, duration: v }))}
            />
          </Input>
        </FormControl>

        <FormControl className="flex-1">
          <FormControlLabel>
            <FormControlLabelText>Capacity</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="1"
              keyboardType="numeric"
              value={form.capacity}
              onChangeText={(v) => setForm((p) => ({ ...p, capacity: v }))}
            />
          </Input>
        </FormControl>
      </HStack>

      <HStack space="md" className="items-end">
        <FormControl className="flex-1">
          <FormControlLabel>
            <FormControlLabelText>Price (RSD)</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={form.amount}
              onChangeText={(v) => setForm((p) => ({ ...p, amount: v }))}
            />
          </Input>
        </FormControl>
        <Checkbox
          size="md"
          value="active"
          isChecked={active}
          onChange={setActive}
          className="mb-2"
        >
          <CheckboxIndicator>
            <CheckboxIcon as={Check} />
          </CheckboxIndicator>
          <CheckboxLabel>Active</CheckboxLabel>
        </Checkbox>
      </HStack>

      <Button
        className="mt-2"
        onPress={handleSubmit}
        isDisabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <Spinner size="small" color="white" />
        ) : (
          <ButtonText className="text-white">Save</ButtonText>
        )}
      </Button>

      <Actionsheet
        isOpen={showSuperSheet}
        onClose={() => setShowSuperSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {superCategories.map((sc) => (
            <ActionsheetItem
              key={sc.id}
              onPress={() => handleSelectSuper(sc.id)}
              className="justify-between"
            >
              <ActionsheetItemText
                className={
                  selectedSuperCategoryId === sc.id ? "font-medium" : ""
                }
              >
                {sc.name}
              </ActionsheetItemText>
              {selectedSuperCategoryId === sc.id && (
                <Icon as={Check} size="sm" className="text-black" />
              )}
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>

      <Actionsheet isOpen={showSubSheet} onClose={() => setShowSubSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {subcategories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <ActionsheetItem
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                className="justify-between"
              >
                <ActionsheetItemText
                  className={isSelected ? "font-medium" : ""}
                >
                  {cat.name}
                </ActionsheetItemText>
                {isSelected && (
                  <Icon as={Check} size="sm" className="text-black" />
                )}
              </ActionsheetItem>
            );
          })}
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};

export default ProfessionalCreateExpertiseForm;
