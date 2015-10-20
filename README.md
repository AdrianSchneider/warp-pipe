# Warp Pipe

Warning: this is a very rough work-in-progress!

Warp pipe lets you securely create named pipes (fifos) between computers, allowing you to send or receive data asynchronously. 

## Use Cases

**Secure Password Passing**

Send from clipboard:

`pbpaste | warp_to coworker_a`

Receive to clipboard

`warp_from coworker_b | pbcopy`

**Perform operation on file**

Instead of asking for things, waiting, manually grabbing it, and acting on it, you can define what you want to do, wait, and then have it happen automatically.

`warp_from coworker_a | import_data_using_config`

`warp_to coworker_b < ~/Files/the-one-he-needs`

## Installation

Manually check out the repo and add the `bin` dir to our path until I publish to npm.

## Authentication

A safe warp pipe requires mutual authentication between the client and server. To start, have the server dump its public key to share with the clients:

`warp_server_key > ./servePublicKey`

Next, the client will need to register the server:

`warp_register <name> -h <hostname> -p <port> < ./serverPublicKey > ./publicKeyToShare`

And finally, the server will need to register the client:

`warp_authorize <name> < ./publicKeyThatWasShared > ./serverPublicKey`

Once this is set up, you can read from `warp_from <name>` or write to `warp_to <name>` as if they were local files.

To illustate the entire flow for the same computer:

`
warp_server_key | warp_register test -h localhost | warp_authorize test
echo "hello" | warp_to test; warp_from test
`

