import { Grid, GridItem } from "@/components/ui/grid";
import { CalendarDays, UserCog, Languages } from "lucide-react-native";
import MenuItem from "./MenuItem";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

const ProfessionalProfileItems = () => {
  const navigation = useAppNavigation();

  return (
    <Grid className="gap-3" _extra={{ className: "grid-cols-2" }}>
      <GridItem _extra={{ className: "col-span-1" }}>
        <MenuItem
          icon={CalendarDays}
          label="Schedule"
          onPress={() => navigation.navigate("professional-schedule")}
        />
      </GridItem>
      <GridItem _extra={{ className: "col-span-1" }}>
        <MenuItem icon={UserCog} label="Account" />
      </GridItem>
      <GridItem _extra={{ className: "col-span-1" }}>
        <MenuItem icon={Languages} label="Language" />
      </GridItem>
    </Grid>
  );
};

export default ProfessionalProfileItems;
