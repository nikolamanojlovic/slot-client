import {
  Button as TamaguiButton,
  styled,
  type ButtonProps as TamaguiButtonProps,
} from "tamagui";

export type ButtonVariant =
  | "primary"
  | "primary-link"
  | "secondary"
  | "secondary-link"
  | "outlined"
  | "outlined-secondary";

interface ButtonProps extends Omit<TamaguiButtonProps, "variant"> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

const PrimaryButton = styled(TamaguiButton, {
  name: "PrimaryButton",
  backgroundColor: "$primary",
  color: "$white",

  hoverStyle: {
    backgroundColor: "$primaryHover",
    borderColor: "none",
  },
  pressStyle: {
    backgroundColor: "$primaryPress",
    borderColor: "none",
  },
  focusStyle: {
    backgroundColor: "$primaryFocus",
    borderColor: "none",
  },
});

const SecondaryButton = styled(TamaguiButton, {
  name: "SecondaryButton",
  backgroundColor: "$white",
  color: "$primary",

  hoverStyle: {
    backgroundColor: "$gray",
    borderColor: "none",
  },
  pressStyle: {
    backgroundColor: "$gray",
    borderColor: "none",
  },
  focusStyle: {
    backgroundColor: "$gray",
    borderColor: "none",
  },
});

const OutlinedSecondaryButton = styled(TamaguiButton, {
  name: "OutlinedSecondaryButton",
  backgroundColor: "transparent",
  color: "$white",
  borderColor: "$white",

  hoverStyle: {
    backgroundColor: "$gray-1",
    borderColor: "$gray",
  },
  pressStyle: {
    backgroundColor: "$gray-1",
    borderColor: "$white",
  },
  focusStyle: {
    backgroundColor: "$gray-1",
    borderColor: "$white",
  },
});

// TODO: Finish this
// const OutlinedPrimaryButton = styled(TamaguiButton, {
//   name: "OutlinedPrimaryButton",
//   backgroundColor: "$background",
//   borderColor: "$primary",
//   color: "$374375",

//   hoverStyle: {
//     borderColor: "$primaryHover",
//   },
//   pressStyle: {
//     borderColor: "$primaryPress",
//   },
//   focusStyle: {
//     borderColor: "$primaryFocus",
//   },
// });

const Button = ({ variant = "primary", children, ...props }: ButtonProps) => {
  switch (variant) {
    case "primary":
      return <PrimaryButton {...props}>{children}</PrimaryButton>;
    case "secondary":
      return <SecondaryButton {...props}>{children}</SecondaryButton>;
    case "outlined-secondary":
      return (
        <OutlinedSecondaryButton {...props}>{children}</OutlinedSecondaryButton>
      );
    default:
      return <TamaguiButton {...props}>{children}</TamaguiButton>;
  }
};

export default Button;
