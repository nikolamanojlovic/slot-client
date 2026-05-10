import { Grid, GridItem } from "@/components/ui/grid";
import {
  CalendarDays,
  UserCog,
  Languages,
  ChartBar,
} from "lucide-react-native";
import CardMenuItem from "./CardMenuItem";
import { useAppNavigation } from "@/src/hooks/useAppNavigation";

const ProfessionalProfileItems = () => {
  const navigation = useAppNavigation();

  return (
    <Grid className="gap-3" _extra={{ className: "grid-cols-2" }}>
      <GridItem _extra={{ className: "col-span-1" }}>
        <CardMenuItem
          icon={CalendarDays}
          label="Schedule"
          onPress={() => navigation.navigate("professional-schedule")}
        />
      </GridItem>
      <GridItem _extra={{ className: "col-span-1" }}>
        <CardMenuItem
          icon={ChartBar}
          label="Analytics"
          onPress={() => navigation.navigate("professional-analytics")}
        />
      </GridItem>
      <GridItem _extra={{ className: "col-span-1" }}>
        <CardMenuItem icon={Languages} label="Language" />
      </GridItem>
      <GridItem _extra={{ className: "col-span-1" }}>
        <CardMenuItem icon={UserCog} label="Account" />
      </GridItem>
    </Grid>
  );
};

export default ProfessionalProfileItems;
