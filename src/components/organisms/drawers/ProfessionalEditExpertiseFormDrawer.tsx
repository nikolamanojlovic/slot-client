import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { X } from "lucide-react-native";
import { colors } from "@/src/constants/colors";
import ProfessionalEditExpertiseForm from "@/src/components/organisms/forms/expretise/ProfessionalEditExpertiseForm";
import type { Expertise } from "@/src/types/api/expertise/expertise.interface";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onError: (error: AxiosError<ErrorResponse>) => void;
  expertise: Expertise;
}

const ProfessionalEditExpertiseFormDrawer = ({
  isOpen,
  onClose,
  onError,
  expertise,
}: Props) => (
  <Drawer isOpen={isOpen} onClose={onClose} anchor="bottom" size="full">
    <DrawerBackdrop />
    <DrawerContent>
      <DrawerHeader>
        <Heading size="lg" className="text-primary-500">
          Edit expertise
        </Heading>
        <DrawerCloseButton>
          <Icon as={X} size="md" color={colors.primary} />
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody>
        <ProfessionalEditExpertiseForm
          expertise={expertise}
          onClose={onClose}
          onError={onError}
        />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default ProfessionalEditExpertiseFormDrawer;
