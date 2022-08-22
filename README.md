# <a href="https://fontmeme.com/bevel-effect/"><img src="https://fontmeme.com/permalink/220818/e900d2b5d35ee518552ff7fbacb016b4.png" alt="bevel-effect" border="0"></a>

## Summer Internship 2022

### Maintainers

- William Rodriguez
- James Fox
- Marcus Lorenzo
- Mark McConnell

## Table Of Contents

* [Description]()
  - [Summary]()
  - [MVP]()
  - [Stretch Goals]()
- [Technologies Used]()
- [Installation, Setup, and Running The App]()
  - [Installation]()
  - [Required Files]()
  - [Running The App Locally]()
- [The Mafia API Reference]()
- [Bugs]()
- [License]()

## ✅ Description

_This a web application that will allow users to play a mafia themed styled hidden role game. Simply put, the objective of the game is for the mafia to “kill” civilians until they are the majority, or for the civilians to kill off the entire mafia. When one of those two things happens, the game is over._

### MVP

- Basic game default settings
- Game logic decides roles based off of the amount of players
- A Help section and or tutorial for first time players
- A flowchart of the game and how to win(Readme)
- A user should be able to host a game
- A user should be able to join a game with an access code
- A clean & easy UI to interact with
- A manual "ready" button to move game forward
- A tooltip for roles to help remind players what their role can/can't do
- A group of user should be able to successfully start and complete a game

### Stretch Goals

[] A simple tutorial toggle with persisted user preferences
[] Customizable settings
[] Mini games between rounds
[] SMS/Email invites
[] A timer
[] Custom Themes
[] In-game communication/Chat


## 🖥️ Technologies Used

- _[React](https://reactjs.org/)_
- _[React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)_
- _[Typescript](https://www.typescriptlang.org/)_
- _[Socket.IO](https://socket.io/)_
- _[Prisma](https://www.prisma.io/)_
- _[PostgreSQL](https://www.postgresql.org/)_
- _[ExpressJs](https://expressjs.com/)_
- _[ViteJS](https://vitejs.dev/)_
- _[Swagger](https://swagger.io/tools/swaggerhub/?&utm_source=aw&utm_medium=ppcg&utm_campaign=SEM_SwaggerHub_PR_NA_ENG_EXT_Prospecting&utm_term=swagger&utm_content=511173019809&gclid=Cj0KCQjwxveXBhDDARIsAI0Q0x3e0_geAzYA0RbSN9shkknno3LoLnkL-Znnr435LWs-hu7fQ3xct5IaArBmEALw_wcB&gclsrc=aw.ds)_

## Installation, Setup, and Running The App

### ⚙️Setup/Installation Requirements

- _Please ensure you have the latest version of NodeJs and PostgreSQL_
- _Clone this repository <https://github.com/eyecuelab/mafia-lite> locally_
- _Navigate to the root folder `mafia-lite` and then `cd api` and run `npm install` and then `cd client` and run `npm install`_.
- See below for required .env files
- You will also need to have your database setup in PostgreSQL
### Required .env Files

- In the `/api` directory, create an .env file and insert the following: `DATABASE_URL="postgresql://postgres:yourPasswordGoesHere@localhost:5432/yourDatabaseNameGoesHere?schema=yourSchemaNameGoesHere"`
- Then save
- In the `/client` directory, create an .env file (separate from the previous), and insert the following: `VITE_API_ENDPOINT=http://localhost:3000`
- Then save

### Running the App Locally

- Split your terminal into two separate consoles
- Navigate one terminal into the `/api` directory and run `npm run dev`
- Navigate the second terminal into the `/client` directory and run `npm run dev` as well. If your browser does not automatically load, type `http://localhost:3000` manually in the browser

## The Mafia API Reference
Everything you need to interact with our API.
### Making Requests
- In progress

- User:
  - GET `/user` retrieves all users.
  - GET `/user/:id` retrieves a single user by id.
  - POST `/user/` creates a new user.
  - PUT `/user/:id` updates a single user.
  - DELETE `user/:id` deletes a single user.

- Game:
  - GET `/game` retrieves all games.
  - GET `/game/:id` retrieves a single game.
  - POST `/game/:id` creates a new game.

- Round:
  - GET `/round/:id` retrieves specific round from game.
  - GET `/rounds/:gameID` retrieves all rounds from game.

### The Request Body
- In progress
### Models
- In progress
### [How to play](https://www.kqed.org/pop/10178/how-to-play-mafia-an-in-depth-guide-to-the-perfect-holiday-game#:~:text=Simply%20put%2C%20the%20objective%20of,happens%2C%20the%20game%20is%20over.)

## Known 🐛 Bugs

* _No Known Issues_

## 🎫License

[MIT](LICENSE) 👈

_If you run into any issues or have questions, ideas, or concerns;  please email us: ._

Copyright (c) 2022 - William Rodriguez - James Fox - Marcus Lorenzo - Mark McConnell
