# Tic-Tac-Toe API & PWA

This is a Tic-Tac-Toe game built with Node.js and Express. The application functions as both a REST API for managing games and as a Progressive Web App (PWA) that can be installed on your device.

**Live Version:** [https://demo25-main.onrender.com/](https://demo25-main.onrender.com/)

## Installation and Running the Project

To run the project locally, follow these steps:

### 1. Download the Project
Clone the repository from GitHub:

```sh
git clone https://github.com/andreasenoksen/demo25-main.git
cd demo25-main
```

### 2. Install Dependencies
Run the following command to install necessary packages:

```sh
npm install
```

### 3. Start the Server
To start the server locally, use:

```sh
npm start
```

The server will run on `http://localhost:3000`.

## How the Game Works

The game works by allowing a player to start a new game via the API. Players can then make moves, and the system will check if there is a winner. Results can be stored in a leaderboard.

### Game Flow:
1. Start a new game.
2. Players make moves by submitting their chosen position.
3. The system validates the move and updates the game board.
4. When a player wins, the result is recorded in the leaderboard.
5. Games can be retrieved, deleted, or updated via the API.

## PWA (Progressive Web App)

This application is a PWA, meaning you can install it as an app on your device. This allows you to play offline.

To install:
1. Open the application in a browser that supports PWA (e.g., Chrome or Edge).
2. Click the install button that appears in the address bar.

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Socket.io
- Service Workers for PWA support
