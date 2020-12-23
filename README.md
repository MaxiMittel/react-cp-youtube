<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/MaxiMittel/react-cp-youtube">
    <img src="icon.png" alt="Logo" height="80">
  </a>
  <h3 align="center">Custom Youtube Player</h3>

  <p align="center">
    <br />
    <a href="https://frnds.watch">See it in action</a>
    ·
    <a href="https://github.com/MaxiMittel/react-cp-youtube/issues">Report Bug</a>
    ·
    <a href="https://github.com/MaxiMittel/react-cp-youtube/issues">Request Feature</a>
  </p>
</p>

## Information

**NOTE: This is stil under development. Don't use in production.**

This React component wraps custom controls around a YouTube video for better information about what the user is doing.

## Preview

![preview](preview.png)

## Install

```sh
npm i react-cp-youtube
```

<!-- USAGE EXAMPLES -->

## Usage

```tsx
import VideoPlayer from "react-cp-youtube";
import '../node_modules/react-cp-youtube/dist/bundle.css';

...
<VideoPlayer
  playing={boolean}
  time={number}
  rate={number}
  videoId={string}
  onPlaybackRateChange={(rate: number) => void}
  onVideoFinished={() => void}
  onTimeChange={(time: number) => void}
  onPlay={() => void}
  onPause={() => void}
/>
```

<!-- CONTRIBUTING -->

## Props

Changing `playing`, `time`, `rate` or `videoId` will result in the player changing those attributes. E.g Changing `time` will result in the player skipping to the provided second.

| name                   | type                     | description                                                                                            |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `playing`              | `boolean`                | Changes the video state to either playing or paused.                                                   |
| `time`                 | `number`                 | Sets the time in seconds.                                                                              |
| `rate`                 | `number`                 | Sets the playback rate of the video.                                                                   |
| `videoId`              | `string`                 | Sets the id of the video currently played.                                                             |
| `onPlaybackRateChange` | `(rate: number) => void` | Is triggered when the user changes the playback rate. (Coming soon)                                    |
| `onVideoFinished`      | `() => void`             | Is triggered when the current video finished playing.                                                  |
| `onTimeChange`         | `(time: number) => void` | Is triggered when the user changes the time of the video.                                              |
| `onPlay`               | `() => void`             | Is triggered when the user resumes the video. (NOTE: A time change will trigger `onPlay` or `onPause`) |
| `onPause`              | `() => void`             | Is triggered when the user pauses the video. (NOTE: A time change will trigger `onPlay` or `onPause`)  |

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Maximilian Mittelhammer - [@maxi_maximittel](https://twitter.com/maxi_maximittel) - maximittel@outlook.de

Project Link: [https://github.com/MaxiMittel/react-cp-youtube](https://github.com/MaxiMittel/react-cp-youtube)
