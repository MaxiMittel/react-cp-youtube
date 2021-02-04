import * as React from "react";
import { useState } from "react";
import { Icon } from "./Icon";
import "./styles/toggleButton.css";
import volume_mute_solid from "./icons/volume-mute-solid.svg";
import volume_up_solid from "./icons/volume-up-solid.svg";
import volume_down_solid from "./icons/volume-down-solid.svg";
import { VideoProgress } from "./VideoProgress";

interface Props {
  volume: number;
  alwayShow: boolean;
  onVolumeChange: (val: number) => void;
}

export const VolumeControl: React.FC<Props> = (props: Props) => {
  const [showVolume, setShowVolume] = useState(false);

  // ############# Volume expand ##############

  const enterVolumeArea = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowVolume(true);
  };

  const leaveVolumeArea = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setShowVolume(false);
  };

  return (
    <div
      className="volume-container"
      onMouseEnter={enterVolumeArea}
      onMouseLeave={leaveVolumeArea}
    >
      <Icon
        style={{ width: "1em" }}
        icon={
          props.volume == 0
            ? volume_mute_solid
            : props.volume < 50
            ? volume_down_solid
            : volume_up_solid
        }
        onClick={() => props.onVolumeChange(props.volume == 0 ? 100 : 0)}
      />
      {(showVolume || props.alwayShow) && (
        <div
          style={{
            width: "4em",
            display: "inline-block",
            verticalAlign: "middle",
            marginLeft: "1em",
          }}
        >
          <VideoProgress
            value={props.volume}
            min={0}
            max={100}
            color="white"
            onChange={props.onVolumeChange}
            onInput={props.onVolumeChange}
          />
        </div>
      )}
    </div>
  );
};
