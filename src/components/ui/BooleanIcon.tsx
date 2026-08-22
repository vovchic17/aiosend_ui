import falseIcon from "../../assets/false.svg";
import trueIcon from "../../assets/true.svg";

type BooleanIconProps = {
  value: boolean;
};

export function BooleanIcon({ value }: BooleanIconProps) {
  return (
    <img
      src={value ? trueIcon : falseIcon}
      alt={value ? "True" : "False"}
      width={24}
      height={24}
      className="h-6 w-6"
      draggable={false}
    />
  );
}
