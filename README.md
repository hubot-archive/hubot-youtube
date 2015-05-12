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

Obtain a [Google Developer Console](https://console.developers.google.com) token. You will want the "Public" token rather than the OAuth credentials for this particular implementation. [Learn more](https://developers.google.com/console/help/new/?hl=en_US#generatingdevkeys)

```
export YOUTUBE_API_KEY=<your token>
```

## Sample Interaction

```
user1> hubot youtube no no no cat remix
hubot> http://www.youtube.com/watch?v=z7OJ3vDqyw8&feature=youtube_gdata
```
