# Tic-Tac-Toe API

Dette er en enkel Tic-Tac-Toe API-tjeneste som lar brukere opprette og spille Tic-Tac-Toe via HTTP-forespørsler. 

## Live Demo (Prod - Render)

API Base URL: [https://demo25-main.onrender.com](https://demo25-main.onrender.com)

## Prosjektstruktur
- `server.js` - Hovedserverfilen som håndterer API-endepunktene.
- `utils/ticTacToeTree.mjs` - Spillmotor for Tic-Tac-Toe, inkluderer trestrukturen for spillet.
- `public/index.html` - Enkel frontend for å spille Tic-Tac-Toe.
- `postman/TicTacToe-Postman.json` - Postman-kolleksjon for testing av API-et.

## Hvordan kjøre lokalt

### 1. Klone repoet
```sh
 git clone https://github.com/andreasenoksen/demo25-main.git
 cd demo25-main
```

### 2. Installer avhengigheter
```sh
 npm install
```

### 3. Start serveren
```sh
 node server.js
```
Serveren vil kjøre på http://localhost:3000.

## API Endepunkter

### 1. Opprett et nytt spill
- Metode: `POST`
- URL: `/games`
- Respons:
  ```json
  {
    "gameId": "1712034123456",
    "board": [null, null, null, null, null, null, null, null, null]
  }
  ```

### 2. Hent status for et spill
- Metode: `GET`
- URL: `/games/{gameId}`
- Respons:
  ```json
  {
    "board": ["X", null, null, "O", null, null, null, null, null]
  }
  ```

### 3. Gjør et trekk
- Metode: `PUT`
- URL: `/games/{gameId}/move`
- Body:
  ```json
  {
    "moveIndex": 0,
    "player": "X"
  }
  ```
- Respons:
  ```json
  {
    "board": ["X", null, null, null, null, null, null, null, null],
    "winner": null
  }
  ```

### 4. Registrer en vinner
- Metode: `POST`
- URL: `/games/{gameId}/winner`
- Body:
  ```json
  {
    "winner": "X"
  }
  ```
- Respons:
  ```json
  {
    "message": "Leaderboard updated: X now has 5 wins."
  }
  ```

### 5. Hent leaderboard
- Metode: `GET`
- URL: `/leaderboard`
- Respons:
  ```json
  {
    "X": 5,
    "O": 2
  }
  ```

### 6. Slett et spill
- Metode: `DELETE`
- URL: `/games/{gameId}`
- Respons: `204 No Content`

## Postman Kolleksjon
For enklere testing, importer Postman-kolleksjonen fra:
```
postman/TicTacToe-Postman.json
```
