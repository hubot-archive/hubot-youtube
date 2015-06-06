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

## Configuration

Setting the environment variable `HUBOT_YOUTUBE_DETERMINISTIC_RESULTS` to `true`
will force `hubot-youtube` to only request one result from the YouTube API. This
means, for a given set of results available on YouTube, `hubot-youtube` will
only get the most relevant result. Other values for this variable will result in
`hubot-youtube` selecting a result at random from the most relevant results
returned by the YouTube API.

## Sample Interaction

```
user1> hubot youtube no no no cat remix
hubot> http://www.youtube.com/watch?v=z7OJ3vDqyw8&feature=youtube_gdata
```
