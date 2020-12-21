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
  onPlaybackRateChange={(rate: number) => void}
  onVideoFinished={() => void}
  onTimeChange={(time: number) => void}
  videoId={string}
  onPlay={() => void}
  onPause={() => void}
/>
```
<!-- CONTRIBUTING -->

## Props


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
