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
import ProfessionalCreateExpertiseForm from "@/src/components/organisms/forms/expretise/ProfessionalCreateExpertiseForm";

import { AxiosError } from "axios";
import { ErrorResponse } from "@/src/types/common/error.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onError: (error: AxiosError<ErrorResponse>) => void;
  tenantId: string;
  professionalId: string;
}

const ProfessionalCreateExpertiseFormDrawer = ({
  isOpen,
  onClose,
  onError,
  tenantId,
  professionalId,
}: Props) => (
  <Drawer isOpen={isOpen} onClose={onClose} anchor="bottom" size="full">
    <DrawerBackdrop />
    <DrawerContent>
      <DrawerHeader>
        <Heading size="lg" className="text-primary-500">
          Create expertise
        </Heading>
        <DrawerCloseButton>
          <Icon as={X} size="md" color={colors.primary} />
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody>
        <ProfessionalCreateExpertiseForm
          tenantId={tenantId}
          professionalId={professionalId}
          onClose={onClose}
          onError={onError}
        />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default ProfessionalCreateExpertiseFormDrawer;
