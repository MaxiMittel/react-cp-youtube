import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { isMobile } from "react-device-detect";
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

import cog_solid from "./icons/cog-solid.svg";
import compress_solid from "./icons/compress-solid.svg";
import expand_solid from "./icons/expand-solid.svg";
import forward_solid from "./icons/forward-solid.svg";
import pause_solid from "./icons/pause-solid.svg";
import play_solid from "./icons/play-solid.svg";
import chevron_up_solid from "./icons/chevron-up-solid.svg";
import times_solid from "./icons/times-solid.svg";
import { Icon } from "./Icon";
import { VolumeControl } from "./VolumeControl";

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
  const [isPlaying, setIsPlaying] = useState(
    props.playing === undefined ? true : props.playing
  );
  const [showControls, setShowControls] = useState(true);
  const [hoverControls, setHoverControls] = useState(false);
  const [showPlaybackRateOptions, setShowPlaybackRateOptions] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [qualityLevels, setQualityLevels] = useState(["-"]);
  const [fullScreenMargin, setFullScreenMargin] = useState(0);
  const timeoutRef = useRef<any>(null);
  const size = useWindowSize();
  //const [showVolume, setShowVolume] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const video_container = React.useRef<HTMLDivElement>(null);

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
      let startTime = 0;
      if (props.time) startTime = props.time;

      youtubePlayer.loadVideoById(props.videoId, startTime);
    }
  }, [props.videoId]);

  const seekTime = async (time: number) => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      var duration = await youtubePlayer.getDuration();
      let newTime = time;

      if (newTime > duration) {
        newTime = duration;
      } else if (newTime < 0) {
        newTime = 0;
      }

      youtubePlayer.seekTo(newTime);
      return newTime;
    }
    return 0;
  };

  /**
   * Handle time change
   */
  useEffect(() => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      if (props.time !== undefined) {
        youtubePlayer.seekTo(props.time);
      }
    }
  }, [props.time]);

  /**
   * Handle playing change
   */
  useEffect(() => {
    if (props.playing !== undefined) togglePlay(props.playing);
  }, [props.playing]);

  /**
   * Handle playback rate change
   */
  useEffect(() => {
    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      if (props.playing !== undefined)
        youtubePlayer.setPlaybackRate(props.rate);
    }
  }, [props.rate]);

  //################## Handle keyboard input ##################

  //TODO: Correct type
  const keyboardEvents = (event: any) => {
    if (props.disableKb === true || event.target !== document.body) return;

    event.preventDefault();

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
      
      if(val == 0){
        youtubePlayer.mute();
      }else if(youtubePlayer.isMuted()){
        youtubePlayer.unMute();
      }

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
      setTime((val / 100) * duration);
      setFormatedTime(
        formatTime((val / 100) * duration) + " / " + formatTime(duration)
      );
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

  useEffect(() => {
    const interval = setInterval(function () {
      var elem = document.activeElement;
      if (elem && elem.tagName == "IFRAME") {
        clearInterval(interval);
        window.focus();
        (elem as HTMLElement).blur();
      }
    }, 100);
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
    if (props.onStateChange) props.onStateChange(event.data);
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
    if (props.onVideoFinished) {
      console.warn(
        "DEPRECATION WARNING: onVideoFinished will be deprecated in further versions. Please use onEnd."
      );
      props.onVideoFinished();
    }
    if (props.onEnd) props.onEnd();
  };

  const _onError = (event: any) => {
    if (props.onError) props.onError(event.data);
  };

  const _onReady = (_: any) => {
    if (props.onReady) props.onReady();

    if (player !== null) {
      var youtubePlayer = (player as any).internalPlayer;
      if (isPlaying) {
        youtubePlayer.playVideo();
      } else {
        youtubePlayer.pauseVideo();
      }
    }
  };

  const _onPlaybackQualityChange = (event: any) => {
    if (props.onPlaybackQualityChange)
      props.onPlaybackQualityChange(event.data);
  };

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
      <div
        className="control-options"
        style={{ maxHeight: getVideoContainerHeight() * 0.8 }}
      >
        <h2>Speed</h2>
        <ul>
          {steps.map((value: number, index: number) => {
            return (
              <li
                key={index}
                onClick={() => changePlaybackRate(value)}
                style={{
                  fontWeight: playbackRate == value ? "bold" : "initial",
                }}
              >
                {value == 1.0 ? "Standard" : value}
              </li>
            );
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
      <div
        className="control-options"
        style={{ maxHeight: getVideoContainerHeight() * 0.8 }}
      >
        <h2>Quality</h2>
        <ul>
          {qualityLevels.map(function (level: string, i: number) {
            return (
              <li onClick={() => changeQuality(level)} key={i}>
                {mapQuality(level)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const getVideoContainerHeight = () => {
    let bounds = video_container.current?.getBoundingClientRect();
    if (bounds) {
      return bounds.height;
    }

    return 200;
  };

  const toggleQuality = (s: boolean) => {
    if (s) {
      setShowQualityOptions(false);
      setShowPlaybackRateOptions(true);
    } else {
      setShowQualityOptions(false);
      setShowPlaybackRateOptions(false);
    }
  };

  const togglePlaybackRate = (s: boolean) => {
    if (s) {
      setShowPlaybackRateOptions(false);
      setShowQualityOptions(true);
    } else {
      setShowPlaybackRateOptions(false);
      setShowQualityOptions(false);
    }
  };

  const toggleFullscreen = (s: boolean) => {
    if (s) {
      handle.enter();
    } else {
      handle.exit();
    }
  };

  const toggleMobileSettings = (_: boolean) => {
    requestQualityLevels();
    setShowMobileSettings(true);
  };

  // ############# Volume expand end ##########

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

  const DesktopPlayer = () => {
    return (
      <div>
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
            <div className="control-shadow">
              <div className="controlRow1">
                <VideoProgress
                  value={time}
                  min={0}
                  max={100}
                  color="#ff0000"
                  onChange={handleTimeChange}
                  onInput={handleTimeInput}
                />
              </div>
              <div className="controlRow2">
                <ToggleButton
                  style={{ marginRight: "0.5em", width: "1em" }}
                  onToggle={togglePlay}
                  onImage={pause_solid}
                  offImage={play_solid}
                  value={isPlaying}
                />
                <VolumeControl
                  volume={volume}
                  onVolumeChange={volumeOnChange}
                  alwayShow={false}
                />
                <span className="timeInfo">{formatedTime}</span>
                <div style={{ float: "right" }}>
                  <ToggleButton
                    style={{ marginRight: "1em" }}
                    onToggle={toggleQuality}
                    onImage={forward_solid}
                    offImage={forward_solid}
                    value={showPlaybackRateOptions}
                  />
                  <ToggleButton
                    style={{ marginRight: "1em" }}
                    onToggle={togglePlaybackRate}
                    onImage={cog_solid}
                    offImage={cog_solid}
                    value={showQualityOptions}
                  />
                  <ToggleButton
                    style={{}}
                    onToggle={toggleFullscreen}
                    onImage={compress_solid}
                    offImage={expand_solid}
                    value={isFullscreen}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobilePlayer = () => {
    return (
      <div>
        {!showControls && (
          <div onClick={() => setShowControls(true)} className="mobile-expand">
            <img
              src={chevron_up_solid}
              alt="expand"
              className="mobile-expand-icon"
            />
          </div>
        )}
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
            <div className="control-shadow">
              <div className="controlRow1">
                <VideoProgress
                  value={time}
                  min={0}
                  max={100}
                  color="#ff0000"
                  onChange={handleTimeChange}
                  onInput={handleTimeInput}
                />
              </div>
              <div className="controlRow2">
                <ToggleButton
                  style={{ marginRight: "0.5em", width: "1em" }}
                  onToggle={togglePlay}
                  onImage={pause_solid}
                  offImage={play_solid}
                  value={isPlaying}
                />
                <span className="timeInfo">{formatedTime}</span>
                <div style={{ float: "right" }}>
                  <ToggleButton
                    style={{ marginRight: "1em" }}
                    onToggle={toggleMobileSettings}
                    onImage={cog_solid}
                    offImage={cog_solid}
                    value={showPlaybackRateOptions}
                  />
                  <ToggleButton
                    style={{}}
                    onToggle={toggleFullscreen}
                    onImage={compress_solid}
                    offImage={expand_solid}
                    value={isFullscreen}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showMobileSettings && (
          <div className="mobile-settings">
            <Icon
              icon={times_solid}
              onClick={() => setShowMobileSettings(false)}
              className="mobile-settings-close"
            />
            <h2>Volume</h2>
            <hr />
            <VolumeControl
              volume={volume}
              onVolumeChange={volumeOnChange}
              alwayShow={true}
            />
            <h2>Quality</h2>
            <hr />
            <select onChange={() => changeQuality("")}>
              {qualityLevels.map(function (level: string, i: number) {
                return (
                  <option key={i} value={level}>
                    {mapQuality(level)}
                  </option>
                );
              })}
            </select>
            <h2>Playbackrate</h2>
            <hr />
            <select
              value={playbackRate}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                changePlaybackRate(parseFloat(e.target.value));
              }}
            >
              {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map(function (
                rate: number,
                i: number
              ) {
                return (
                  <option key={i} value={rate}>
                    {rate == 1.0 ? "Standard" : rate}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    );
  };

  return (
    <FullScreen handle={handle} onChange={fullscreenChanged}>
      <div className="videoPlayer">
        {MoveDetectors()}
        <div
          className="video-container"
          style={{ marginTop: fullScreenMargin }}
          ref={video_container}
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
            onReady={_onReady}
            onEnd={_onEnd}
            onError={_onError}
            onPlaybackQualityChange={_onPlaybackQualityChange}
          />
        </div>
        {isMobile && MobilePlayer()}
        {!isMobile && DesktopPlayer()}
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

  if (isNaN(hours)) {
    hours_str = "00";
  }

  if (isNaN(minutes)) {
    minutes_str = "00";
  }

  if (isNaN(seconds)) {
    seconds_str = "00";
  }

  return (hours !== 0 ? hours_str + ":" : "") + minutes_str + ":" + seconds_str;
};

var mapQuality = (quality: string) => {
  const qualities = new Map([
    ["tiny", "144p"],
    ["small", "240p"],
    ["medium", "320p"],
    ["large", "480p"],
    ["hd720", "720p"],
    ["hd1080", "1080p"],
    ["hd1440", "1440p"],
    ["hd2160", "2160p"],
    ["hd4320", "4320p"],
  ]);

  return !qualities.has(quality) ? quality : qualities.get(quality);
};

export default VideoPlayer;
export { YouTubeOptions, PlayerVars, YouTubeRef };
