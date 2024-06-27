# JWT Authentication

![Alt text](/public/images/jwt.png) – A powerful and intuitive authentication tool based on the JsonWebToken RSA key-pair algorithm. It offers a quick start with Node.js, Express.js, and OpenID-Client, featuring pre-defined User and OTP schemas for storing user credentials in the database. Built with TypeScript, it comes with a pre-defined configuration, eliminating the need to set up tools like nodemon, tsconfig, etc. 🚀

## Quick Start Guide

-   Ensure all code is compiled by running `tsc` in the terminal to initialize the server.
-   Generate the public and private key pair using `node dist/utils/crypto.js` for authentication.
-   Create an `.env` file with the environment variables listed in the `env.example` file.
-   Start the server by running the `r.bat` file or using the `npm run dev` command in the terminal.

### If everything goes well, the server terminal will display the following messages:

```
Server listening at http://localhost:8000
MongoDB Connected
```
