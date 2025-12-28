import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const BusinessSearch = () => {
  return (
    <Input className="w-full" size="md">
      <InputSlot className="pl-3">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField placeholder="Explore businesses" />
    </Input>
  );
};

export default BusinessSearch;
