import * as React from "react";
import { useEffect, useState, useRef } from 'react';
import "./styles/videoPlayer.css";
import { ToggleButton } from "./ToggleButton";
import {
  FullScreen,
  useFullScreenHandle,
  FullScreenHandle,
} from "react-full-screen";
import YouTube, { Options } from "react-youtube";
import { VideoProgress } from "./VideoProgress";

import playButton from "./icons/playButton.svg";
import pauseButton from "./icons/pauseButton.svg";
import enterFullscreen from "./icons/enterFullscreen.svg";
import leaveFullscreen from "./icons/leaveFullscreen.svg";


interface Props {
  videoId: string;
  playing: boolean;
  time: number;
  rate: number;
  onTimeChange: (time: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onVideoFinished: () => void;
  onPlay: () => void;
  onPause: () => void;
}

let player: YouTube | null;

const VideoPlayer: React.FC<Props> = (props: Props) => {
  const handle = useFullScreenHandle();
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [formatedTime, setFormatedTime] = useState("0:00 / 0:00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(props.playing);
  const [showControls, setShowControls] = useState(true);
  const [hoverControls, setHoverControls] = useState(false);
  const timeoutRef = useRef<any>(null);


  //################## Handle prop changes ##################

  /**
   * Handle videoid change
   */
  useEffect(() =>{
    if (player !== null){
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.cueVideoById(props.videoId);
    }
  },[props.videoId])

  /**
   * Handle time change
   */
  useEffect(() =>{
    if (player !== null){
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.seekTo(props.time);
    }
  },[props.time])

  /**
   * Handle playing change
   */
  useEffect(() =>{
    togglePlay(props.playing);
  },[props.playing])

  /**
   * Handle playback rate change
   */
  useEffect(() =>{
    if (player !== null){
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.setPlaybackRate(props.rate);
    }
  },[props.rate])


  //################## Handle keyboard input ##################

  //TODO: Correct type
  const keyboardEvents = (event: any) => {
    switch (event.code) {
      case "Space":
        togglePlay(!isPlaying);
        break;
      case "ArrowRight":
        skip();
        break;
      case "ArrowLeft":
        back();
        break;
      default:
        break;
    }
  };

  /**
   * Skip 5 seconds ahead
   */
  const skip = async () => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var currentTime = await youtubePlayer.getCurrentTime();
      var duration = await youtubePlayer.getDuration();
      if (currentTime + 5 < duration) {
        youtubePlayer.seekTo(currentTime + 5);
      } else {
        youtubePlayer.seekTo(duration - .1);
      }
    }
  };

  /**
   * Go back 5 seconds
   */
  const back = async () => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var currentTime = await youtubePlayer.getCurrentTime();
      if (currentTime - 5 > 0) {
        youtubePlayer.seekTo(currentTime - 5);
      } else {
        youtubePlayer.seekTo(.1);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardEvents, false);
    return () => document.removeEventListener("keydown", keyboardEvents, false);
  });

  //################## Other Functions ##################

  const togglePlay = (state: boolean) => {
    setIsPlaying(state);
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      if (state) {
        youtubePlayer.playVideo();
      } else {
        youtubePlayer.pauseVideo();
      }
    }
  };

  const volumeOnChange = async (val: number) => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.setVolume(val);
      setVolume(val);
    }
  };

  //################## Time related functions ##################

  const handleTimeChange = async (val: number) => {
    handleTimeInput(val);
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var duration = await youtubePlayer.getDuration();
      props.onTimeChange((val / 100) * duration);
    }
  };

  const handleTimeInput = async (val: number) => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var duration = await youtubePlayer.getDuration();
      youtubePlayer.seekTo((val / 100) * duration);
    }
  };

  //Handles videoInformation time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      if (player !== null) {
        var youtubePlayer = (player as any).internalPlayer;
        var currentTime = await youtubePlayer.getCurrentTime();
        var duration = await youtubePlayer.getDuration();
        setTime((currentTime / duration) * 100);
        setFormatedTime(formatTime(currentTime) + " / " + formatTime(duration));
      }
    }, 500);
    return () => clearInterval(interval);
  });

  //################## Handle fullscreen change ##################

  const fullscreenChanged = (state: boolean, _: FullScreenHandle) => {
    setIsFullscreen(state);
  };

  //################## Move detection ##################

  const handleMove = (_: React.MouseEvent) => {
    setShowControls(true);
  };

  const handleMouseEnter = (_: React.MouseEvent) => {
    setHoverControls(true);
  };

  const handleMouseLeave = (_: React.MouseEvent) => {
    setHoverControls(false);
  };

  const MoveDetectors = () => {
    const items = [];

    for (let index = 0; index < 9; index++) {
      items.push(
        <div
          className="moveDetectorHorizontal"
          key={"mdh-" + index}
          style={{ top: index + 1 + "0%" }}
          onMouseMove={handleMove}
        ></div>
      );
      items.push(
        <div
          className="moveDetectorVertical"
          key={"mdv-" + index}
          style={{ left: index + 1 + "0%" }}
          onMouseMove={handleMove}
        ></div>
      );
    }

    return items;
  };

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    if (hoverControls) return;

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setShowControls(false);
    }, 5000);
  }, [showControls, hoverControls]);

  //################## Handle youtube events ##################

  const _onStateChange = (event: any) => {
    if (event.data === 0) {
      props.onVideoFinished();
    }
  };

  const _onPlay = () => {
    setIsPlaying(true);
    props.onPlay();
  };

  const _onPause = () => {
    setIsPlaying(false);
    props.onPause();
  };

  /**
   * Handles the onPlaybackRateChange event of the YouTube player.
   */
  const _onPlaybackRateChange = async () => {
    var youtubePlayer = (player as any).internalPlayer;
    let playBackRate = await youtubePlayer.getPlaybackRate();

    props.onPlaybackRateChange(playBackRate);
  };

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      controls: 0,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      autoplay: 1,
      disablekb: 1,
      showinfo: 0,
      iv_load_policy: 3,
    },
  };

  return (
    <FullScreen handle={handle} onChange={fullscreenChanged}>
      <div className="videoPlayer">
        {MoveDetectors()}
        <div className="video-container">
          <YouTube
            videoId={props.videoId}
            opts={opts}
            ref={(ref) => (player = ref)}
            onPlay={_onPlay}
            onPause={_onPause}
            onStateChange={_onStateChange}
            onPlaybackRateChange={_onPlaybackRateChange}
          />
        </div>
        {showControls && (
          <div
            className="controls"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="controlRow1">
              <VideoProgress
                value={time}
                min={0}
                max={100}
                onChange={handleTimeChange}
                onInput={handleTimeInput}
              />
            </div>
            <div className="controlRow2">
              <ToggleButton
                style={{ marginRight: "0.5em", width: "1em" }}
                onToggle={togglePlay}
                onImage={pauseButton}
                offImage={playButton}
                value={isPlaying}
              />
              <div
                style={{
                  width: "4em",
                  display: "inline-block",
                  verticalAlign: "middle",
                  marginLeft: "1em",
                  marginRight: "1em",
                }}
              >
                <VideoProgress
                  value={volume}
                  min={0}
                  max={100}
                  onChange={volumeOnChange}
                  onInput={volumeOnChange}
                />
              </div>
              <span className="timeInfo">{formatedTime}</span>
              <div style={{ float: "right" }}>
                <ToggleButton
                  style={{}}
                  onToggle={(s: boolean) => {
                    if (s) {
                      handle.exit();
                    } else {
                      handle.enter();
                    }
                  }}
                  onImage={leaveFullscreen}
                  offImage={enterFullscreen}
                  value={isFullscreen}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </FullScreen>
  );
};

/**
 * Format seconds into hh:mm:ss
 * @param ins The seconds to format.
 */
var formatTime = function (ins: number) {
  ins = Math.floor(ins);
  var hours = Math.floor(ins / 3600);
  var minutes = Math.floor((ins - hours * 3600) / 60);
  var seconds = ins - hours * 3600 - minutes * 60;

  let hours_str = "";
  let minutes_str = "";
  let seconds_str = "";

  if (hours < 10) {
    hours_str = "0" + hours;
  } else {
    hours_str = "" + hours;
  }
  if (minutes < 10) {
    minutes_str = "0" + minutes;
  } else {
    minutes_str = "" + minutes;
  }
  if (seconds < 10) {
    seconds_str = "0" + seconds;
  } else {
    seconds_str = "" + seconds;
  }
  return (hours !== 0 ? hours_str + ":" : "") + minutes_str + ":" + seconds_str;
};

export default VideoPlayer;