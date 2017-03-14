# Chat Wall API

This document describes the API for developers wishing to implement a
client for the Chat Wall system. It is ordered in the way a user will
initially interact with the system (registration -> authentication ->
read wall -> write to wall).

This API is authenticated using a token system. Tokens are
automatically generated for users. As the token is passed with each
request and holds "the keys to the kingdom" for the user, the API
should always be deployed under HTTPS.

## Users

### Registration

    POST: /api/users/
    Fields: username*, password*, email
    * required fields

Register a new user. Email is not required, but if supplied a welcome
email will be sent to the user.

### Authentication

    POST: /api/users/token/
    Fields: username*, password*
    * required fields

Returns the token for a user. This token should be supplied with
subsequent requests to authenticate the user.


## Chat Wall

### Read chat wall messages

    GET: /api/wall/

Returns a list of messages.

    [
        {
            "message": "A test message",
            "user": {
                "username": "TestUser"
            },
            "timestamp": "2017-03-12T20:15:58Z"
        },
    }

### Create chat wall message

    POST: /api/wall/
    Fields: message*
    * required fields
    `Authentication` required

Users must be authenticated to post to the wall. Returns the created
message.
