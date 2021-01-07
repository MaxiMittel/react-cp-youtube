import * as React from "react";
import "./styles/toggleButton.css";

interface Props {
  icon: string;
  style: object;
}

export const Icon: React.FC<Props> = (props: Props) => {
  return (
    <div className="toggleButton" style={props.style}>
      <img
        src={props.icon}
        alt="icon"
        className="toggleButtonImage"
      />
    </div>
  );
};
