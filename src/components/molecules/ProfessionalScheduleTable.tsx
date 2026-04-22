import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { Check } from "lucide-react-native";
import { View } from "react-native";
import { TimePicker } from "@/src/components/molecules/TimePicker";
import { DayOfWeek } from "@/src/api/workingHours";

export const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "MONDAY", label: "Mon" },
  { key: "TUESDAY", label: "Tue" },
  { key: "WEDNESDAY", label: "Wed" },
  { key: "THURSDAY", label: "Thu" },
  { key: "FRIDAY", label: "Fri" },
  { key: "SATURDAY", label: "Sat" },
  { key: "SUNDAY", label: "Sun" },
];

export type RowState = {
  working: boolean;
  startTime: Date | null;
  endTime: Date | null;
};

export const WEEKEND: DayOfWeek[] = ["SATURDAY", "SUNDAY"];

export const makeDefaultTime = (hours: number, minutes = 0) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export const defaultRows = (): Record<DayOfWeek, RowState> =>
  Object.fromEntries(
    DAYS.map(({ key }) => {
      const working = !WEEKEND.includes(key);
      return [
        key,
        {
          working,
          startTime: working ? makeDefaultTime(9) : null,
          endTime: working ? makeDefaultTime(17) : null,
        },
      ];
    }),
  ) as Record<DayOfWeek, RowState>;

interface Props {
  rows: Record<DayOfWeek, RowState>;
  onUpdate: (day: DayOfWeek, patch: Partial<RowState>) => void;
}

const ProfessionalScheduleTable = ({ rows, onUpdate }: Props) => (
  <Table style={{ minHeight: "70%" }}>
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        <TableHead>Day</TableHead>
        <TableHead>Start</TableHead>
        <TableHead>End</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {DAYS.map(({ key, label }) => (
        <TableRow key={key}>
          <TableData useRNView>
            <View style={{ width: "100%", alignItems: "center" }}>
              <Checkbox
                size="sm"
                value={key}
                isChecked={rows[key].working}
                onChange={(checked) =>
                  onUpdate(key, {
                    working: checked,
                    startTime: checked
                      ? (rows[key].startTime ?? makeDefaultTime(9))
                      : null,
                    endTime: checked
                      ? (rows[key].endTime ?? makeDefaultTime(17))
                      : null,
                  })
                }
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={Check} />
                </CheckboxIndicator>
              </Checkbox>
            </View>
          </TableData>
          <TableData>{label}</TableData>
          <TableData
            useRNView
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <TimePicker
              value={rows[key].startTime}
              disabled={!rows[key].working}
              onChange={(d) => onUpdate(key, { startTime: d })}
            />
          </TableData>
          <TableData useRNView>
            <TimePicker
              value={rows[key].endTime}
              disabled={!rows[key].working}
              onChange={(d) => onUpdate(key, { endTime: d })}
            />
          </TableData>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ProfessionalScheduleTable;
