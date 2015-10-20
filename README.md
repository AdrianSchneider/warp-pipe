# Warp Pipe

WARNING: This is a work in progress. The mutual authentication is not set up yet, so while the server authorizes and can subsequently trust the client, the client cannot yet trust the server.

Warp pipe lets you securely create named pipes (fifos) between computers, allowing you to send or receive data asynchronously.

## Use Cases

**Secure Password Passing**

Send from clipboard: 

```pbpaste | warp_to coworker_a```

Receive to clipboard

```warp_from coworker_b | pbcopy```

**Perform operation on file**

Instead of asking for things, waiting, manually grabbing it, and acting on it, you can define what you want to do, wait, and then have it happen automatically.

```warp_from coworker_a | import_data_using_config```

```warp_to coworker_b < ~/Files/the-one-he-needs```

## Installation

Holding off on npm install until security implementation is wrapped up.

**Register a remote server / warp pipe:**

`warp_register <name> -h <hostname> -p <port> > ./publicKeyToShare` 

**Authorize client on other server:**

`warp_authorize <name> < ./publicKeyThatWasShared`

Once this is set up, you can read from `warp_from <name>` or write to `warp_to <name>` as if they were local files.
