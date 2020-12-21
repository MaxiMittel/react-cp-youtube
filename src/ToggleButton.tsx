import * as React from "react";
import { useState } from 'react';
import "./styles/toggleButton.css";


interface Props {
  onToggle: (state: boolean) => void;
  value: boolean;
  onImage: string;
  offImage: string;
  style: object;
}

export const ToggleButton: React.FC<Props> = (props: Props) => {
  const [state, setState] = useState(props.value);

  const toggle = () => {
    setState(!state);
    props.onToggle(state);
  };

  return (
    <div onClick={toggle} className="toggleButton" style={props.style}>
      <img src={state ? props.onImage : props.offImage} alt="toggleButton" className="toggleButtonImage"/>
    </div>
  );
};
