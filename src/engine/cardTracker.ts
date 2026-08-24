import { Card, CardTrackerState, Position, Suit, Trick } from '../types/spades';
import { SUITS } from './deck';

export function createInitialTracker(): CardTrackerState {
  const unplayedAces: Record<Suit, boolean> = {
    spades: true,
    hearts: true,
    diamonds: true,
    clubs: true,
  };
  const unplayedKings: Record<Suit, boolean> = {
    spades: true,
    hearts: true,
    diamonds: true,
    clubs: true,
  };

  const playerKnownVoids: Record<Position, Record<Suit, boolean>> = {
    north: { spades: false, hearts: false, diamonds: false, clubs: false },
    east: { spades: false, hearts: false, diamonds: false, clubs: false },
    south: { spades: false, hearts: false, diamonds: false, clubs: false },
    west: { spades: false, hearts: false, diamonds: false, clubs: false },
  };

  return {
    remainingSpades: 13,
    spadesBroken: false,
    playedCards: [],
    unplayedAces,
    unplayedKings,
    playerKnownVoids,
  };
}

export function updateTrackerWithTrick(
  prevTracker: CardTrackerState,
  trick: Trick
): CardTrackerState {
  const newTracker: CardTrackerState = {
    ...prevTracker,
    playedCards: [...prevTracker.playedCards],
    unplayedAces: { ...prevTracker.unplayedAces },
    unplayedKings: { ...prevTracker.unplayedKings },
    playerKnownVoids: {
      north: { ...prevTracker.playerKnownVoids.north },
      east: { ...prevTracker.playerKnownVoids.east },
      south: { ...prevTracker.playerKnownVoids.south },
      west: { ...prevTracker.playerKnownVoids.west },
    },
  };

  if (trick.cards.length === 0) return newTracker;

  const leadCard = trick.cards[0].card;
  const leadSuit = trick.leadSuit || leadCard.suit;

  for (let i = 0; i < trick.cards.length; i++) {
    const { position, card } = trick.cards[i];

    // Add to played cards
    newTracker.playedCards.push(card);

    // Spade check
    if (card.suit === 'spades') {
      newTracker.remainingSpades = Math.max(0, newTracker.remainingSpades - 1);
      newTracker.spadesBroken = true;
    }

    // Ace/King check
    if (card.rank === 'A') {
      newTracker.unplayedAces[card.suit] = false;
    }
    if (card.rank === 'K') {
      newTracker.unplayedKings[card.suit] = false;
    }

    // Void inference: If non-lead card did not match leadSuit, player has NO cards in leadSuit!
    if (i > 0 && card.suit !== leadSuit) {
      newTracker.playerKnownVoids[position][leadSuit] = true;
    }
  }

  return newTracker;
}

/**
 * Returns remaining unseen cards given known hand and played cards.
 */
export function getUnseenCards(myHand: Card[], playedCards: Card[]): Card[] {
  const seenIds = new Set([...myHand.map((c) => c.id), ...playedCards.map((c) => c.id)]);
  const allCards: Card[] = [];
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
  const values: Record<string, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14,
  };

  for (const s of suits) {
    for (const r of ranks) {
      const id = `${s}-${r}`;
      if (!seenIds.has(id)) {
        allCards.push({ id, suit: s, rank: r, value: values[r] });
      }
    }
  }

  return allCards;
}
