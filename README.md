# Tic-Tac-Toe Game

**Live Demo:** [Visit the Live App on Render](https://demo25-main.onrender.com)

---

## About the Game

This is a classic **Tic-Tac-Toe** game where two players (X and O) compete by taking turns to mark spaces in a 3x3 grid. The first player to align three marks horizontally, vertically, or diagonally wins the game. If all spaces are filled without a winner, the game ends in a draw.

### Features
- **Player Input:** Players can enter their names for personalized gameplay.
- **Leaderboard:** Displays the top 5 players with the highest number of wins.
- **Game History:** Shows the last 5 games played, including player names and the winner or if it was a draw.
- **Restart Game:** Allows restarting the game after a win or draw.
- **PWA (Progressive Web App):** Installable on devices and works offline.
- **Responsive Design:** Optimized for both desktop and mobile devices.

---

## Technologies Used

- **HTML, CSS, JavaScript:** Core technologies for building the frontend and interactivity.
- **Node.js and Express.js:** Backend server setup for handling API requests and serving static files.
- **PostgreSQL:** Database for storing game data, leaderboard, and history.
- **Render:** Hosting platform for both the server and PostgreSQL database.
- **PGAdmin 4:** GUI for managing the PostgreSQL database.
- **Postman:** Used for testing API endpoints during development.
- **Service Worker:** For caching static assets and enabling offline support.
- **Manifest.json:** For configuring PWA properties and icons.

---

## Project Setup Explanation

- **Separation of Concerns:**
  - The **frontend** (HTML, CSS, JS) is served from the `public` directory.
  - The **backend** handles API requests and manages database interactions.
  - Middleware is used for **logging**, **error handling**, and **input validation**.

- **Why Render?**
  - Simplified deployment for both the server and database.
  - Scalable and easy to manage through GitHub integration.

- **Database Persistence:**
  - PostgreSQL is used for its reliability and integration with Render.
  - Data persists between server restarts, ensuring long-term record keeping.

- **Offline Functionality:**
  - The service worker caches essential assets for offline use.
  - Users can play the game without an active internet connection after initial load.

---

## How the Leaderboard and Game History Work

- **Leaderboard:**
  - Displays the top 5 players based on the number of wins.
  - Automatically updates after each game completion.

- **Game History:**
  - Shows details of the last 5 games, including:
    - Player names (X and O).
    - The winner or if the game was a draw.

---

## Notes

- The service worker will cache necessary files for offline use.
- Remember to increment the cache version in `service-worker.js` when updating files.
- Use `Postman` to test API endpoints and verify data flow.
- PostgreSQL is managed via `PGAdmin 4` for local testing and Render for production.

---

## Author
Developed by Andreas Enoksen
