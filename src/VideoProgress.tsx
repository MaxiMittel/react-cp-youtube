import * as React from "react";
import { useEffect, useState, useRef } from 'react';
import "./styles/progressBar.css";

interface Props {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  onInput: (val: number) => void;
}

export const VideoProgress: React.FC<Props> = (props: Props) => {
  const [val, setVal] = useState(props.value);
  const outer_div = React.useRef<HTMLDivElement>(null);
  const _mouse_pressed = useRef(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (_mouse_pressed.current) {
      var bounds = outer_div.current?.getBoundingClientRect();
      if (bounds) {
        var max = bounds.width;
        var pos = event.pageX - bounds.left;
        var percentage = Math.round((pos / max) * 100);
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        setVal(percentage);
        props.onInput(percentage);
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    _mouse_pressed.current = true;
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    _mouse_pressed.current = false;
    props.onChange(val);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    _mouse_pressed.current = false;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (_mouse_pressed.current) {
      var bounds = outer_div.current?.getBoundingClientRect();
      if (bounds) {
        var max = bounds.width;
        var pos = event.pageX - bounds.left;
        var percentage = Math.round((pos / max) * 100);
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        setVal(percentage);
        props.onChange(percentage);
      }
    }
  };

  useEffect(() => {
    if (!_mouse_pressed.current) {
      setVal(props.value);
    }
  }, [props.value]);

  return (
    <div>
      <div
        className="custom-youtube-player-progress-bar-outer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        ref={outer_div}
      >
        <div
          className="custom-youtube-player-progress-bar-inner"
          style={{ width: val + "%" }}
        >
          <div
            className="custom-youtube-player-progress-bar-knob"
            style={{ left: "calc(" + val + "% - 8px)" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
