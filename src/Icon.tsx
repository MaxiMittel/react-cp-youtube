import * as React from "react";
import "./styles/toggleButton.css";

interface Props {
  icon: string;
  className?: string;
  style?: object;
  onClick?: () => void;
}

export const Icon: React.FC<Props> = (props: Props) => {
  return (
    <div className={"toggleButton" + " " + props.className} style={props.style} onClick={props.onClick}>
      <img
        src={props.icon}
        alt="icon"
        className="toggleButtonImage"
      />
    </div>
  );
};
