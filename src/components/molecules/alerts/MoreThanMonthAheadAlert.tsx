import { Alert, AlertText } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react-native";

const MoreThanMonthAheadAlert = () => (
  <Alert action="warning" className="mb-3">
    <TriangleAlert size={16} color="#b45309" className="mr-2" />
    <AlertText className="text-xs flex-1">
      For appointments more than a month away, availability isn't guaranteed and
      may change.
    </AlertText>
  </Alert>
);

export default MoreThanMonthAheadAlert;
