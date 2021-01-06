import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { isMobile } from "react-device-detect";
import "./styles/progressBar.css";

interface Props {
  value: number;
  min: number;
  max: number;
  color: string;
  onChange: (val: number) => void;
  onInput: (val: number) => void;
}

export const VideoProgress: React.FC<Props> = (props: Props) => {
  const [val, setVal] = useState(props.value);
  const outer_div = React.useRef<HTMLDivElement>(null);
  const [showMouseTracker, setShowMouseTracker] = useState(false);
  const _mouse_pressed = useRef(false);

  const bounds_width = useRef(0);
  const bounds_left = useRef(0);

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleMove(event.changedTouches[0].pageX);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleMove(event.pageX);
  };

  const handleMove = (pgX: number) => {
    if (_mouse_pressed.current) {
      var max = bounds_width.current;
      var pos = pgX - bounds_left.current;
      var percentage = Math.round((pos / max) * 100);
      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;
      setVal(percentage);
      props.onInput(percentage);
    }
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    let bounds = outer_div.current?.getBoundingClientRect();
    if (bounds) {
      bounds_width.current = bounds.width;
      bounds_left.current = bounds.left;
    }

    _mouse_pressed.current = true;

    setShowMouseTracker(true);
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    _mouse_pressed.current = false;
    props.onChange(val);

    setShowMouseTracker(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();    

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
    
  };

  useEffect(() => {
    if (!_mouse_pressed.current) {
      setVal(props.value);
    }
  }, [props.value]);

  return (
    <div>
      {showMouseTracker && (
        <div
          className="hidden-mouse-tracker unselectable"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onMouseLeave={handleMouseUp}
        ></div>
      )}
      <div
        className="custom-youtube-player-progress-bar-outer unselectable"
        onClick={handleClick}
        ref={outer_div}
      >
        <div
          className="custom-youtube-player-progress-bar-inner unselectable"
          onClick={handleClick}
          style={{ width: val + "%", backgroundColor: props.color }}
        >
          <div
            className="custom-youtube-player-progress-bar-knob unselectable"
            style={{
              left: "calc(" + val + "% - 6px)",
              backgroundColor: props.color,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          ></div>
          {isMobile && (
            <div
              className="custom-youtube-player-progress-bar-hidden-knob unselectable"
              style={{
                left: "calc(" + val + "% - 18px)"
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};
