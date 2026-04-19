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
import { AxiosError } from "axios";
import { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { ErrorResponse } from "@/src/types/common/error.interface";
import { updateExpertise, deleteExpertise } from "@/src/api/expertise";
import { useCategoryTree } from "@/src/hooks/useCategoryTree";

interface Props {
  expertise: Expertise;
  onClose: () => void;
  onError: (error: AxiosError<ErrorResponse>) => void;
}

const ProfessionalEditExpertiseForm = ({
  expertise,
  onClose,
  onError,
}: Props) => {
  const queryClient = useQueryClient();
  const { superCategories } = useCategoryTree();

  const initialSuperCategoryId =
    superCategories.find((sc) =>
      sc.subcategories.some((c) => expertise.categories.includes(c.id)),
    )?.id ?? null;

  const [form, setForm] = useState({
    name: expertise.name,
    description: expertise.description,
    duration: String(expertise.duration),
    capacity: String(expertise.capacity),
    amount: expertise.price ? String(expertise.price.amount) : "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    expertise.categories,
  );
  const [showSuperSheet, setShowSuperSheet] = useState(false);
  const [showSubSheet, setShowSubSheet] = useState(false);
  const [selectedSuperCategoryId, setSelectedSuperCategoryId] = useState<
    string | null
  >(initialSuperCategoryId);

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
    mutationFn: updateExpertise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expertises/me"] });
      onClose();
    },
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteExpertise(expertise.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expertises/me"] });
      onClose();
    },
    onError,
  });

  const handleSubmit = () => {
    const patch: Parameters<typeof updateExpertise>[0] = { expertiseId: expertise.id };

    if (form.name !== expertise.name) patch.name = form.name;
    if (form.description !== expertise.description) patch.description = form.description;
    if (parseInt(form.duration, 10) !== expertise.duration) patch.duration = parseInt(form.duration, 10);
    if (parseInt(form.capacity, 10) !== expertise.capacity) patch.capacity = parseInt(form.capacity, 10);
    if (form.amount !== "" && parseFloat(form.amount) !== expertise.price?.amount) patch.amount = parseFloat(form.amount);

    const categoriesChanged =
      selectedCategories.length !== expertise.categories.length ||
      selectedCategories.some((id) => !expertise.categories.includes(id));
    if (categoriesChanged) patch.categories = selectedCategories;

    mutation.mutate(patch);
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

      <Button
        className="mt-1"
        action="negative"
        onPress={() => deleteMutation.mutate()}
        isDisabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? (
          <Spinner size="small" color="white" />
        ) : (
          <ButtonText className="text-white">Delete</ButtonText>
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

export default ProfessionalEditExpertiseForm;
