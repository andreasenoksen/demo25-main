
import { v4 as uuidv4 } from 'uuid';

class DeckManager {
  constructor() {
    this.decks = {};
  }

  createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = [
      '2', '3', '4', '5', '6', '7', '8', '9', '10',
      'Jack', 'Queen', 'King', 'Ace',
    ];

    const deck = suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
    const deck_id = uuidv4();
    this.decks[deck_id] = { cards: deck, drawn: [] };
    return deck_id;
  }

  getDeck(deck_id) {
    const deck = this.decks[deck_id];
    if (!deck) throw new Error('Deck not found');
    return deck.cards;
  }

  shuffleDeck(deck_id) {
    const deck = this.decks[deck_id];
    if (!deck) throw new Error('Deck not found');
    deck.cards = deck.cards.sort(() => Math.random() - 0.5);
  }

  drawCard(deck_id) {
    const deck = this.decks[deck_id];
    if (!deck) throw new Error('Deck not found');
    if (deck.cards.length === 0) throw new Error('No cards left in the deck');

    const card = deck.cards.pop();
    deck.drawn.push(card);
    return card;
  }
}

export default new DeckManager();
