# hubot-youtube

[![npm version](https://badge.fury.io/js/hubot-youtube.svg)](http://badge.fury.io/js/hubot-youtube) ![Node.js CI](https://github.com/hubot-scripts/hubot-youtube/workflows/Node.js%20CI/badge.svg)

A Hubot script for searching YouTube.

## Installation

In the Hubot project repo, run:

`npm install hubot-youtube --save`

Then add **hubot-youtube** to your `external-scripts.json`:

```json
[
  "hubot-youtube"
]
```

### Obtain a [Google Developer Console](https://console.developers.google.com) token

Enable the "YouTube Data API v3" permission from the API menu.

![Enable v3](https://cloud.githubusercontent.com/assets/80459/7863722/8161df38-0523-11e5-931a-5c2bf6d8105b.png)

Create a "Public" token rather than the OAuth credentials for this particular implementation. 

![Get Public Token](https://cloud.githubusercontent.com/assets/80459/7600553/f2fa44c2-f8d1-11e4-8edf-009c0e3f04f1.png)

Copy your token to the `HUBOT_YOUTUBE_API_KEY` environment variable.

```
export HUBOT_YOUTUBE_API_KEY=<your token>
```

_[Learn more](https://developers.google.com/console/help/new/?hl=en_US#generatingdevkeys) about how to generate Google credentials._

### Optionally set flag for deterministic searching

If you want Hubot to only return the most relevant result rather than randomly one of the top 15 results, set the environment variable `HUBOT_YOUTUBE_DETERMINISTIC_RESULTS`.

```
export HUBOT_YOUTUBE_DETERMINISTIC_RESULTS=true
```

### Optionally set flag for listening on public channel

If you want Hubot to listen every messages (without mentioning the bot) on public channel, set `HUBOT_YOUTUBE_HEAR`.

```
export HUBOT_YOUTUBE_HEAR=true
```

### Optionally set flag for displaying the video title

If you want Hubot to display the video title along with the URL, set `HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE`.

```
export HUBOT_YOUTUBE_DISPLAY_VIDEO_TITLE=true
```

### Optionally set flag for decoding HTML entities in the video title

If you want Hubot to decode any HTML entities in the video title, set `HUBOT_YOUTUBE_DECODE_HTML`.

```
export HUBOT_YOUTUBE_DECODE_HTML=true
```

## Sample Interaction

```
user1> hubot youtube no no no cat remix
hubot> http://www.youtube.com/watch?v=z7OJ3vDqyw8&feature=youtube_gdata
```
