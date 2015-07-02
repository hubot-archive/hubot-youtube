# hubot-youtube

A hubot script for searching YouTube

See [`src/youtube.coffee`](src/youtube.coffee) for full documentation.

## Installation

In hubot project repo, run:

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

If you want hubot to only return the most relevant result rather than randomly one of the top 15 results, set the environment variable `HUBOT_YOUTUBE_DETERMINISTIC_RESULTS`.

```
export HUBOT_YOUTUBE_DETERMINISTIC_RESULTS=true
```

## Sample Interaction

```
user1> hubot youtube no no no cat remix
hubot> http://www.youtube.com/watch?v=z7OJ3vDqyw8&feature=youtube_gdata
```
