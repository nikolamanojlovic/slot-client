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
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Check, ChevronDown } from "lucide-react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SuperCategory } from "@/src/types/api/category/category.interface";
import { createExpertise } from "@/src/api/expertise";

interface ProfessionalCreateExpertiseFormProps {
  superCategories: SuperCategory[];
  tenantId: string;
  professionalId: string;
  onClose: () => void;
}

const ProfessionalCreateExpertiseForm = ({
  superCategories,
  tenantId,
  professionalId,
  onClose,
}: ProfessionalCreateExpertiseFormProps) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    capacity: "",
  });
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

  const subLabel =
    selectedCategories.length === 0
      ? "Select subcategory"
      : subcategories
          .filter((c) => selectedCategories.includes(c.id))
          .map((c) => c.name)
          .join(", ");

  const mutation = useMutation({
    mutationFn: createExpertise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expertises/me"] });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setForm({ name: "", description: "", duration: "", capacity: "" });
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
          >
            {subLabel}
          </Text>
          <Icon as={ChevronDown} size="sm" className="text-background-500" />
        </Pressable>
      </FormControl>

      <Button
        className="bg-black mt-2"
        onPress={handleSubmit}
        isDisabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <Spinner size="small" color="white" />
        ) : (
          <ButtonText className="text-white">Add</ButtonText>
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

      <Actionsheet
        isOpen={showSubSheet}
        onClose={() => setShowSubSheet(false)}
      >
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
                <ActionsheetItemText className={isSelected ? "font-medium" : ""}>
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
