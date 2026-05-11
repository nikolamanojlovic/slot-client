import { Fab } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { BrainCircuit } from "lucide-react";
import { type ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Fab>, "children">;

const AISchedulingFab = (props: Props) => (
  <Fab size="sm" placement="bottom right" {...props}>
    <Icon as={BrainCircuit} size="sm" color="#ffffff" />
  </Fab>
);

export default AISchedulingFab;
