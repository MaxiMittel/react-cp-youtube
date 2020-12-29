import * as React from "react";
import { useEffect, useState, useRef } from "react";
import "./styles/videoPlayer.css";
import { ToggleButton } from "./ToggleButton";
import {
  FullScreen,
  useFullScreenHandle,
  FullScreenHandle,
} from "react-full-screen";
import YouTube, { Options, PlayerVars } from "react-youtube";
import { VideoProgress } from "./VideoProgress";
import useWindowSize from "./windowSize";

import playButton from "./icons/playButton.svg";
import pauseButton from "./icons/pauseButton.svg";
import enterFullscreen from "./icons/enterFullscreen.svg";
import leaveFullscreen from "./icons/leaveFullscreen.svg";
import i_changeQuality from "./icons/changeQuality.svg";
import i_changeQualitySolid from "./icons/changeQualitySolid.svg";
import i_changePlaybackrate from "./icons/changePlaybackrate.svg";
import i_changePlaybackrateSolid from "./icons/changePlaybackrateSolid.svg";

interface VideoPlayerProps {
  videoId: string;
  options?: YouTubeOptions;
  playing?: boolean;
  time?: number;
  rate?: number;
  disableKb?: boolean;
  onTimeChange?: (time: number) => void;
  onTimeUpdate?: (time: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  ytRef?: (ref: YouTubeRef) => void;
  onReady?: () => void;
  onVideoFinished?: () => void;
  onEnd?: () => void;
  onError?: (error: number) => void;
  onPlaybackQualityChange?: (quality: string) => void;
  onStateChange?: (state: any) => void;
}

type YouTubeRef = YouTube | null;

type YouTubeOptions = {
  autoplay?: PlayerVars["autoplay"];
  cc_load_policy?: PlayerVars["cc_load_policy"];
  color?: PlayerVars["color"];
  controls?: PlayerVars["controls"];
  disablekb?: PlayerVars["disablekb"];
  enablejsapi?: PlayerVars["enablejsapi"];
  end?: PlayerVars["end"];
  fs?: PlayerVars["fs"];
  hl?: PlayerVars["hl"];
  iv_load_policy?: PlayerVars["iv_load_policy"];
  list?: PlayerVars["list"];
  listType?: PlayerVars["listType"];
  loop?: PlayerVars["loop"];
  modestbranding?: PlayerVars["modestbranding"];
  origin?: PlayerVars["origin"];
  playlist?: PlayerVars["playlist"];
  playsinline?: PlayerVars["playsinline"];
  rel?: PlayerVars["rel"];
  showinfo?: PlayerVars["showinfo"];
  start?: PlayerVars["start"];
};

let player: YouTubeRef;

const VideoPlayer: React.FC<VideoPlayerProps> = (props: VideoPlayerProps) => {
  const handle = useFullScreenHandle();
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [formatedTime, setFormatedTime] = useState("0:00 / 0:00");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(props.playing || true);
  const [showControls, setShowControls] = useState(true);
  const [hoverControls, setHoverControls] = useState(false);
  const [showPlaybackRateOptions, setShowPlaybackRateOptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [qualityLevels, setQualityLevels] = useState(["-"]);
  const [fullScreenMargin, setFullScreenMargin] = useState(0);
  const timeoutRef = useRef<any>(null);
  const size = useWindowSize();

  useEffect(() => {
    if (isFullscreen) {
      let availWidth = size.width;
      let availHeight = size.height;
      let videoHeight = (availWidth / 16) * 9;
      let mgTop = (availHeight - videoHeight) / 2;
      setFullScreenMargin(mgTop);
    } else {
      setFullScreenMargin(0);
    }
  }, [size]);

  //################## Handle prop changes ##################

  /**
   * Handle videoid change
   */
  useEffect(() => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.cueVideoById(props.videoId, props.time || 0);
    }
  }, [props.videoId]);

  const seekTime = async (time: number) =>{
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var duration = await youtubePlayer.getDuration();
      let newTime = time;

      if(newTime > duration){
        newTime = duration;
      }else if(newTime < 0){
        newTime = 0;
      }

      youtubePlayer.seekTo(newTime);
      return newTime;
    }
    return 0;
  }

  /**
   * Handle time change
   */
  useEffect(() => {
    seekTime(props.time || 0);
  }, [props.time]);

  /**
   * Handle playing change
   */
  useEffect(() => {
    togglePlay(props.playing || true);
  }, [props.playing]);

  /**
   * Handle playback rate change
   */
  useEffect(() => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.setPlaybackRate(props.rate || 1);
    }
  }, [props.rate]);

  //################## Handle keyboard input ##################

  //TODO: Correct type
  const keyboardEvents = (event: any) => {
    if(props.disableKb === true) return;
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
      let newTime = await seekTime(currentTime + 10);
      if (props.onTimeChange) props.onTimeChange(newTime);
      if (props.onTimeUpdate) props.onTimeUpdate(newTime);
    }
  };

  /**
   * Go back 5 seconds
   */
  const back = async () => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var currentTime = await youtubePlayer.getCurrentTime();
      let newTime = await seekTime(currentTime - 10);
      if (props.onTimeChange) props.onTimeChange(newTime);
      if (props.onTimeUpdate) props.onTimeUpdate(newTime);
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
      let newTime = (val / 100) * duration;
      if (props.onTimeChange) props.onTimeChange(newTime);
      if (props.onTimeUpdate) props.onTimeUpdate(newTime);
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
        if (props.onTimeUpdate) props.onTimeUpdate(currentTime);
      }
    }, 500);
    return () => clearInterval(interval);
  });

  //################## Handle fullscreen change ##################

  const fullscreenChanged = (state: boolean, _: FullScreenHandle) => {
    if (state) {
      let availWidth = size.width;
      let availHeight = size.height;
      let videoHeight = (availWidth / 16) * 9;
      let mgTop = (availHeight - videoHeight) / 2;
      setFullScreenMargin(mgTop);
    } else {
      setFullScreenMargin(0);
    }

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
    if(props.onStateChange) props.onStateChange(event.data);
  };

  const _onPlay = () => {
    setShowControls(true);
    setIsPlaying(true);
    if (props.onPlay) props.onPlay();
  };

  const _onPause = () => {
    setShowControls(true);
    setIsPlaying(false);
    if (props.onPause) props.onPause();
  };

  const _onEnd = (_: any) => {
    if (props.onVideoFinished){
      console.warn("DEPRECATION WARNING: onVideoFinished will be deprecated in further versions. Please use onEnd.");
      props.onVideoFinished();
    }
    if (props.onEnd) props.onEnd();
  }

  const _onError = (event: any) => {
    if (props.onError) props.onError(event.data);
  }

  const _onPlaybackQualityChange = (event: any) => {
    if (props.onPlaybackQualityChange) props.onPlaybackQualityChange(event.data);
  }

  /**
   * Handles the onPlaybackRateChange event of the YouTube player.
   */
  const _onPlaybackRateChange = async () => {
    var youtubePlayer = (player as any).internalPlayer;
    let playBackRate = await youtubePlayer.getPlaybackRate();

    if (props.onPlaybackRateChange) props.onPlaybackRateChange(playBackRate);
    setPlaybackRate(playBackRate);
  };

  const changePlaybackRate = (rate: number) => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.setPlaybackRate(rate);
    }
    setPlaybackRate(rate);
    setShowPlaybackRateOptions(false);
  };

  const playbackRateOptions = () => {
    let steps = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

    return (
      <div className="control-options">
        <h2>Speed</h2>
        <ul>
          {steps.map((value: number, index: number) => {
            return (<li
              key={index}
              onClick={() => changePlaybackRate(value)}
              style={{ fontWeight: playbackRate == value ? "bold" : "initial" }}
            >
              {value == 1.0 ? "Standard" : value}
            </li>);
          })}
        </ul>
      </div>
    );
  };

  const changeQuality = (quality: string) => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      youtubePlayer.setPlaybackQuality(quality);
    }
    setShowQualityOptions(false);
  };

  const requestQualityLevels = async () => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      let ql = await youtubePlayer.getAvailableQualityLevels();
      setQualityLevels(ql);
    }
  };

  const qualityOptions = () => {
    requestQualityLevels();
    return (
      <div className="control-options">
        <h2>Quality</h2>
        <ul>
          {qualityLevels.map(function (level: string, i: number) {
            return (
              <li onClick={() => changeQuality(level)} key={i}>
                {level}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      controls: props.options?.controls || 0,
      playsinline: props.options?.playsinline || 1,
      rel: props.options?.rel || 0,
      modestbranding: props.options?.modestbranding || 1,
      autoplay: props.options?.autoplay || 1,
      disablekb: props.options?.disablekb || 1,
      showinfo: props.options?.showinfo || 0,
      iv_load_policy: props.options?.iv_load_policy || 3,
      ...props.options,
    },
  };

  return (
    <FullScreen handle={handle} onChange={fullscreenChanged}>
      <div className="videoPlayer">
        {MoveDetectors()}
        <div
          className="video-container"
          style={{ marginTop: fullScreenMargin }}
        >
          <YouTube
            videoId={props.videoId}
            opts={opts}
            ref={(ref) => {
              player = ref;
              if (props.ytRef) props.ytRef(ref);
            }}
            onPlay={_onPlay}
            onPause={_onPause}
            onStateChange={_onStateChange}
            onPlaybackRateChange={_onPlaybackRateChange}
            onReady={props.onReady}
            onEnd={_onEnd}
            onError={_onError}
            onPlaybackQualityChange={_onPlaybackQualityChange}
          />
        </div>
        {showControls && (
          <div
            className="controls"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="controlRow0">
              {showPlaybackRateOptions && playbackRateOptions()}
              {showQualityOptions && qualityOptions()}
            </div>
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
                  style={{ marginRight: "1em" }}
                  onToggle={(s: boolean) => {
                    if (s) {
                      setShowQualityOptions(false);
                      setShowPlaybackRateOptions(true);
                    } else {
                      setShowQualityOptions(false);
                      setShowPlaybackRateOptions(false);
                    }
                  }}
                  onImage={i_changePlaybackrateSolid}
                  offImage={i_changePlaybackrate}
                  value={showPlaybackRateOptions}
                />
                <ToggleButton
                  style={{ marginRight: "1em" }}
                  onToggle={(s: boolean) => {
                    if (s) {
                      setShowPlaybackRateOptions(false);
                      setShowQualityOptions(true);
                    } else {
                      setShowPlaybackRateOptions(false);
                      setShowQualityOptions(false);
                    }
                  }}
                  onImage={i_changeQualitySolid}
                  offImage={i_changeQuality}
                  value={showQualityOptions}
                />
                <ToggleButton
                  style={{}}
                  onToggle={(s: boolean) => {
                    if (s) {
                      handle.enter();
                    } else {
                      handle.exit();
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
export { YouTubeOptions, PlayerVars, YouTubeRef };
