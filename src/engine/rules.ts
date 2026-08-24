import { Card, PlayedCard, Position, Suit, Trick } from '../types/spades';

/**
 * Checks if a player has any cards of the specified suit in hand.
 */
export function hasSuit(hand: Card[], suit: Suit): boolean {
  return hand.some((c) => c.suit === suit);
}

/**
 * Checks if a player's hand contains only Spades.
 */
export function hasOnlySpades(hand: Card[]): boolean {
  return hand.length > 0 && hand.every((c) => c.suit === 'spades');
}

/**
 * Returns all legally playable cards from a player's hand given the current trick state.
 */
export function getLegalMoves(
  hand: Card[],
  currentTrick: Trick,
  spadesBroken: boolean
): Card[] {
  if (hand.length === 0) return [];

  // Case 1: Leading the trick
  if (currentTrick.cards.length === 0) {
    if (!spadesBroken) {
      const nonSpades = hand.filter((c) => c.suit !== 'spades');
      // If player has non-spade cards, they cannot lead with spades
      if (nonSpades.length > 0) {
        return nonSpades;
      }
      // If player ONLY has spades, they are permitted to lead spades
      return hand;
    }
    // Spades already broken - can lead any suit
    return hand;
  }

  // Case 2: Following a lead
  const leadSuit = currentTrick.leadSuit || currentTrick.cards[0].card.suit;
  const leadSuitCards = hand.filter((c) => c.suit === leadSuit);

  // Must follow suit if able
  if (leadSuitCards.length > 0) {
    return leadSuitCards;
  }

  // Void in lead suit: can play any card (spade trumps or off-suit sloughs)
  return hand;
}

/**
 * Validates whether playing a specific card is legal.
 */
export function isMoveLegal(
  card: Card,
  hand: Card[],
  currentTrick: Trick,
  spadesBroken: boolean
): { legal: boolean; reason?: string } {
  // Check if card is in hand
  const cardInHand = hand.some((c) => c.id === card.id);
  if (!cardInHand) {
    return { legal: false, reason: 'Card is not in player hand.' };
  }

  const legalMoves = getLegalMoves(hand, currentTrick, spadesBroken);
  const isLegal = legalMoves.some((c) => c.id === card.id);

  if (!isLegal) {
    if (currentTrick.cards.length === 0 && card.suit === 'spades' && !spadesBroken) {
      return {
        legal: false,
        reason: 'Spades have not been broken yet. You cannot lead a Spade unless you only have Spades left.',
      };
    }
    const leadSuit = currentTrick.leadSuit || currentTrick.cards[0]?.card.suit;
    if (leadSuit && hasSuit(hand, leadSuit) && card.suit !== leadSuit) {
      return {
        legal: false,
        reason: `Must follow suit! You have ${leadSuit} in your hand.`,
      };
    }
    return { legal: false, reason: 'Illegal card play for this trick.' };
  }

  return { legal: true };
}

/**
 * Determines the winner of a completed 4-card trick.
 */
export function evaluateTrickWinner(trick: Trick): {
  winner: Position;
  winningCard: Card;
  brokeSpades: boolean;
} {
  if (trick.cards.length === 0) {
    throw new Error('Cannot evaluate empty trick');
  }

  const leadCard = trick.cards[0].card;
  const leadSuit = trick.leadSuit || leadCard.suit;

  let bestCard = leadCard;
  let winnerPos = trick.cards[0].position;
  let spadePlayed = leadCard.suit === 'spades';

  for (let i = 1; i < trick.cards.length; i++) {
    const { position, card } = trick.cards[i];

    if (card.suit === 'spades') {
      spadePlayed = true;
      if (bestCard.suit !== 'spades') {
        // First spade played beats non-spade lead
        bestCard = card;
        winnerPos = position;
      } else if (card.value > bestCard.value) {
        // Higher spade beats lower spade
        bestCard = card;
        winnerPos = position;
      }
    } else if (card.suit === leadSuit && bestCard.suit !== 'spades') {
      // Followed suit higher than current highest lead card
      if (card.value > bestCard.value) {
        bestCard = card;
        winnerPos = position;
      }
    }
  }

  return {
    winner: winnerPos,
    winningCard: bestCard,
    brokeSpades: spadePlayed,
  };
}

/**
 * Helper to get the next seat in clockwise order.
 */
export function getNextSeat(seat: Position): Position {
  const order: Position[] = ['north', 'east', 'south', 'west'];
  const idx = order.indexOf(seat);
  return order[(idx + 1) % 4];
}

/**
 * Returns the team for a given position.
 */
export function getPlayerTeam(pos: Position): 'team_north_south' | 'team_east_west' {
  return pos === 'north' || pos === 'south' ? 'team_north_south' : 'team_east_west';
}

/**
 * Returns partner position.
 */
export function getPartnerPosition(pos: Position): Position {
  switch (pos) {
    case 'north': return 'south';
    case 'south': return 'north';
    case 'east': return 'west';
    case 'west': return 'east';
  }
}
