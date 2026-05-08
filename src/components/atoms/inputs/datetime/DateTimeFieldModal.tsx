import { useState } from "react";
import DateModal from "./DateModal";
import TimeModal from "./TimeModal";

type CommonProps = {
  isOpen: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
};

type DateProps = CommonProps & {
  mode: "date";
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
};

type TimeProps = CommonProps & {
  mode: "time";
};

type DateTimeProps = CommonProps & {
  mode: "datetime";
  range?: boolean;
  isDisabled?: (date: Date) => boolean;
};

type Props = DateProps | TimeProps | DateTimeProps;

const DateTimeFieldModal = (props: Props) => {
  const [dateStep, setDateStep] = useState<Date>(props.value);
  const [showTime, setShowTime] = useState(false);

  if (props.mode === "time") {
    return (
      <TimeModal
        isOpen={props.isOpen}
        value={props.value}
        onChange={props.onChange}
        onClose={props.onClose}
      />
    );
  }

  if (props.mode === "date") {
    return (
      <DateModal
        isOpen={props.isOpen}
        value={props.value}
        range={props.range}
        isDisabled={props.isDisabled}
        onChange={props.onChange}
        onClose={props.onClose}
      />
    );
  }

  return (
    <>
      <DateModal
        isOpen={props.isOpen && !showTime}
        value={props.value}
        range={props.range}
        isDisabled={props.isDisabled}
        onChange={(d) => {
          setDateStep(d);
          setShowTime(true);
        }}
        onClose={props.onClose}
      />
      <TimeModal
        isOpen={props.isOpen && showTime}
        value={dateStep}
        onChange={(t) => {
          const combined = new Date(dateStep);
          combined.setHours(t.getHours(), t.getMinutes(), 0, 0);
          props.onChange(combined);
          setShowTime(false);
        }}
        onClose={() => setShowTime(false)}
      />
    </>
  );
};

export default DateTimeFieldModal;
