if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.info('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  let currentPlayer = 'X';
  
  function makeMove(cell) {
    if (cell.textContent === '') {
      cell.textContent = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      checkWinner();
    }
  }
  
  function checkWinner() {
  }
  