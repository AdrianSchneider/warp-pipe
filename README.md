# Warp Pipe

Warp pipe lets you securely create named pipes (fifos) between computers, allowing you to send or receive data asynchronously.

## Use Cases

**Secure Password Passing**

Send from clipboard: 

```pbpaste | warp_to adrian```

Receive to clipboard

```warp_from steve | pbcopy```

**Slack: Send me that config file!**

Instead of asking for things, waiting, manually grabbing it, and acting on it, you can define what you want to do, wait, and then have it happen automatically.

```
adrian [1:00 PM]
hey buddy, I'm having troubles getting my server running. can you send me your config?

steve [1:02 PM]
ugh. sure. 

steve [1:02 PM]
Added and commented on a Plain Text snippet: config

adrian [1:04 PM]
thanks
```

To fully "receive" that, it takes a few clicks and awkwardly grabbing the file contents, copying it, and pasting it somewhere. I also need to wait for a response before I can act.

Alternative:

`warp_from steve > ~/Projects/demo/config.json` (waits)

```

adrian [1:00 PM]
hey buddy, I'm having troubles connecting to your server. can you warp me your config?

steve [1:02 PM]
k
```

whenever steve is free:
`warp_to adrian < ~/Projects/demo/config.json`


```
adrian [anytime later]
thanks
```
