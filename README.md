# API project for a vídeo site
This project was created with fastify and mongoDb Atlas.

It was a challenge proposed by the e-learning platform [Alura](https://www.alura.com.br/challenges/back-end/)

___

## Tecnologies Explanation

- **fastify**: I learned about It during the Node.js Services Development (LFW212) course and liked the way It works

- **MongoDB Atlas**: Primarily because I wanted to use a free online DB and I has already used It on a previous course

- **Mongoose**: Fastify has a lot of opitions that take a lot of things from your hand, but I decided to used mongoose to learn how It works and to not rely on things made for fastify.

- **jsonwebtoken**: Decided to use it has a way to autorize users after a login and to learn how It works.

- **TESTS**: I decided to use TAP, and I had to use mongodb-memory-server, this way the tests won't stop if the DB is offline

___

## Requirements

- Store the following information about videos on a DB (every field must be required and valid):
  - id
  - title
  - description
  - url
- Create the following routes for videos:
  - `GET /videos` - return all videos
  - `GET /videos/:id` - return the video if the *id* is valid, if not, return *Not Found*
  - `POST /videos` - create the video if all fields are filled and valid, return a json with the new video information
  - `PUT /videos/:id` - update 1 or more fields of a video, return a json with the updated video information
  - `DELETE /videos/:id` - delete a video, return a message if success or error
- Store the following information about categories on a DB (every field must be required and valid):
  - id
  - title
  - color
- Create the following routes for categories:
  - `GET /categories` - return all categories
  - `GET /categories/:id` - return the category if the *id* is valid, if not, return *Not Found*
  - `POST /categories` - create the category if all fields are filled and valid, return a json with the new category information
  - `PUT /categories/:id` - update 1 or more fields of a category, return a json with the updated category information
  - `DELETE /categories/:id` - delete a category, return a message if success or error
- Create a relationship between video and category, assigning a category for each video
- Create a route `GET /categories/:id/videos` to return all videos with the informed category
- Create a route `GET /videos/?search=title` using query parameters to return videos with the search in the title
- Enable pagination on every `GET` route, limiting the return of 5 itens per page.
- Only authenticated users can use `GET`, `POST`, `PUT` and `DELETE` routes
- Create a `GET /videos/free` route that any user, logged or not, can use to view a limited and fixed number of available movies

___

## Scripts

You can run the scripts below:

### `npm run dev`

To start the app in dev mode.

### `npm start`

For production mode

### `npm test`

Run the test cases.

___

## Future improvements

- Create tests for the Controllers
- Create CI/CD with github
- Create logout route and blocklist to enable block of jwt
