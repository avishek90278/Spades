import { Card, Position, Rank, Suit } from '../types/spades';

export const SUITS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

export const RANKS: Rank[] = [
  '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
];

export const RANK_VALUES: Record<Rank, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export const SUIT_COLORS: Record<Suit, string> = {
  spades: '#1e293b', // deep navy/black
  hearts: '#e11d48', // ruby red
  diamonds: '#ea580c', // rich orange-red
  clubs: '#047857', // emerald green / dark slate
};

/**
 * Generates a full 52-card standard deck.
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
      });
    }
  }
  return deck;
}

/**
 * High-entropy Fisher-Yates shuffle.
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deals 13 cards to each of the four positions.
 */
export function dealHands(deck: Card[]): Record<Position, Card[]> {
  const hands: Record<Position, Card[]> = {
    north: [],
    east: [],
    south: [],
    west: [],
  };

  const positions: Position[] = ['north', 'east', 'south', 'west'];

  deck.forEach((card, index) => {
    const pos = positions[index % 4];
    hands[pos].push(card);
  });

  // Sort each hand neatly
  for (const pos of positions) {
    hands[pos] = sortHand(hands[pos]);
  }

  return hands;
}

/**
 * Sorts hand by suit (Spades, Hearts, Clubs, Diamonds) and then descending rank (A -> 2).
 */
export function sortHand(hand: Card[]): Card[] {
  const suitOrder: Record<Suit, number> = {
    diamonds: 0,
    clubs: 1,
    hearts: 2,
    spades: 3,
  };

  return [...hand].sort((a, b) => {
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.value - b.value;
  });
}

/**
 * Formats a card nicely into text e.g. "A♠" or "10♥"
 */
export function formatCard(card: Card): string {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}
