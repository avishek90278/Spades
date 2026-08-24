import {
  BidValue,
  BotDifficulty,
  Card,
  GameSettings,
  Player,
  PlayerBid,
  Position,
  RoundScoreRecord,
  SpadesGameState,
  TeamId,
  TeamScore,
  Trick,
} from '../types/spades';
import { createDeck, dealHands, shuffleDeck, sortHand } from './deck';
import { evaluateTrickWinner, getNextSeat, getPartnerPosition, isMoveLegal } from './rules';
import { calculateRoundScores } from './scoring';
import { createInitialTracker, updateTrackerWithTrick } from './cardTracker';
import { calculateBotBid, selectBotCard } from './botAI';

export const DEFAULT_SETTINGS: GameSettings = {
  targetScore: 500,
  allowBlindNil: true,
  blindNilBonus: 200,
  nilBonus: 100,
  bagPenaltyThreshold: 10,
  bagPenaltyValue: 100,
  botSpeedMs: 700,
  allowRenegingPenalty: true,
};

export function createInitialTeamScores(): {
  team_north_south: TeamScore;
  team_east_west: TeamScore;
} {
  return {
    team_north_south: {
      teamId: 'team_north_south',
      name: 'North & South',
      totalScore: 0,
      bags: 0,
      totalBagsAccumulated: 0,
      bagPenalties: 0,
      roundBids: { totalBid: 0, nilBids: [] },
      roundTricks: 0,
      roundScoreChange: 0,
    },
    team_east_west: {
      teamId: 'team_east_west',
      name: 'East & West',
      totalScore: 0,
      bags: 0,
      totalBagsAccumulated: 0,
      bagPenalties: 0,
      roundBids: { totalBid: 0, nilBids: [] },
      roundTricks: 0,
      roundScoreChange: 0,
    },
  };
}

export function createDefaultPlayers(
  humanName: string = 'Me',
  botDifficulty: BotDifficulty = 'expert'
): Record<Position, Player> {
  return {
    south: {
      id: 'player_south',
      name: humanName,
      position: 'south',
      team: 'team_north_south',
      type: 'human',
      avatar: '👩‍🦰',
      isReady: true,
      connected: true,
    },
    west: {
      id: 'bot_west',
      name: 'Isabella',
      position: 'west',
      team: 'team_east_west',
      type: 'bot',
      botDifficulty,
      avatar: '👧',
      isReady: true,
      connected: true,
    },
    north: {
      id: 'bot_north',
      name: 'Ashley',
      position: 'north',
      team: 'team_north_south',
      type: 'bot',
      botDifficulty,
      avatar: '👱‍♀️',
      isReady: true,
      connected: true,
    },
    east: {
      id: 'bot_east',
      name: 'Tyler',
      position: 'east',
      team: 'team_east_west',
      type: 'bot',
      botDifficulty,
      avatar: '👵',
      isReady: true,
      connected: true,
    },
  };
}

export function createInitialGameState(
  id: string,
  mode: 'single_player' | 'room' | 'matchmaking' = 'single_player',
  roomCode?: string,
  players?: Record<Position, Player>,
  settings: GameSettings = DEFAULT_SETTINGS
): SpadesGameState {
  return {
    id,
    roomCode,
    mode,
    phase: 'lobby',
    dealer: 'west',
    turn: 'north',
    roundNumber: 0,
    players: players || createDefaultPlayers(),
    hands: { north: [], east: [], south: [], west: [] },
    bids: {},
    currentTrick: { id: 1, cards: [] },
    completedTricks: [],
    tricksWon: { north: 0, east: 0, south: 0, west: 0 },
    spadesBroken: false,
    scores: createInitialTeamScores(),
    history: [],
    settings,
    tracker: createInitialTracker(),
    lastActionMessage: 'Welcome to Spades! Press Start Game to deal the deck.',
  };
}

/**
 * Starts a new round, shuffles and deals 13 cards to each player.
 */
export function startNewRound(state: SpadesGameState): SpadesGameState {
  const nextDealer = state.roundNumber === 0 ? state.dealer : getNextSeat(state.dealer);
  const firstToBid = getNextSeat(nextDealer);

  const deck = shuffleDeck(createDeck());
  const hands = dealHands(deck);

  return {
    ...state,
    phase: 'bidding',
    dealer: nextDealer,
    turn: firstToBid,
    roundNumber: state.roundNumber + 1,
    hands,
    initialHands: {
      north: [...hands.north],
      east: [...hands.east],
      south: [...hands.south],
      west: [...hands.west],
    },
    bids: {},
    currentTrick: { id: 1, cards: [] },
    completedTricks: [],
    tricksWon: { north: 0, east: 0, south: 0, west: 0 },
    spadesBroken: false,
    tracker: createInitialTracker(),
    lastActionMessage: `Round ${state.roundNumber + 1} started. ${state.players[firstToBid].name} is bidding.`,
    aiExplanation: undefined,
  };
}

/**
 * Restarts the current round with the exact same deal (as shown in reference video frame 00:00).
 */
export function restartSameDeal(state: SpadesGameState): SpadesGameState {
  if (!state.initialHands) {
    return startNewRound(state);
  }

  const firstToBid = getNextSeat(state.dealer);
  return {
    ...state,
    phase: 'bidding',
    turn: firstToBid,
    hands: {
      north: [...state.initialHands.north],
      east: [...state.initialHands.east],
      south: [...state.initialHands.south],
      west: [...state.initialHands.west],
    },
    bids: {},
    currentTrick: { id: 1, cards: [] },
    completedTricks: [],
    tricksWon: { north: 0, east: 0, south: 0, west: 0 },
    spadesBroken: false,
    tracker: createInitialTracker(),
    lastActionMessage: `Replaying round ${state.roundNumber}. ${state.players[firstToBid].name} is bidding.`,
    aiExplanation: undefined,
  };
}

/**
 * Places a bid for the current player.
 */
export function placePlayerBid(
  state: SpadesGameState,
  position: Position,
  bidValue: BidValue,
  isBlindNil: boolean = false
): { newState: SpadesGameState; error?: string } {
  if (state.phase !== 'bidding') {
    return { newState: state, error: 'Cannot bid outside bidding phase.' };
  }

  if (state.turn !== position) {
    return { newState: state, error: `It is not ${position}'s turn to bid.` };
  }

  const newBids = {
    ...state.bids,
    [position]: {
      position,
      bid: bidValue,
      isBlindNil: isBlindNil || bidValue === 'blind_nil',
    },
  };

  const positions: Position[] = ['north', 'east', 'south', 'west'];
  const allBid = positions.every((p) => newBids[p] !== undefined);

  if (allBid) {
    // Transition to playing phase
    const leadPlayer = getNextSeat(state.dealer);
    return {
      newState: {
        ...state,
        bids: newBids,
        phase: 'playing',
        turn: leadPlayer,
        currentTrick: { id: 1, cards: [] },
        lastActionMessage: `All bids placed. ${state.players[leadPlayer].name} leads the first trick!`,
      },
    };
  }

  const nextBidder = getNextSeat(position);
  return {
    newState: {
      ...state,
      bids: newBids,
      turn: nextBidder,
      lastActionMessage: `${state.players[position].name} bid ${bidValue}. Now ${state.players[nextBidder].name}'s turn to bid.`,
    },
  };
}

/**
 * Plays a card for the current player.
 */
export function playCardMove(
  state: SpadesGameState,
  position: Position,
  cardId: string
): { newState: SpadesGameState; error?: string } {
  if (state.phase !== 'playing') {
    return { newState: state, error: 'Cannot play card outside playing phase.' };
  }

  if (state.turn !== position) {
    return { newState: state, error: `It is not ${position}'s turn to play.` };
  }

  const playerHand = state.hands[position];
  const cardToPlay = playerHand.find((c) => c.id === cardId);

  if (!cardToPlay) {
    return { newState: state, error: 'Card not found in hand.' };
  }

  const validation = isMoveLegal(
    cardToPlay,
    playerHand,
    state.currentTrick,
    state.spadesBroken
  );

  if (!validation.legal) {
    return { newState: state, error: validation.reason || 'Illegal move.' };
  }

  // Remove card from player hand
  const newHand = playerHand.filter((c) => c.id !== cardId);
  const updatedHands = {
    ...state.hands,
    [position]: newHand,
  };

  // Determine if spades are broken
  let nowSpadesBroken = state.spadesBroken;
  if (cardToPlay.suit === 'spades' && !state.spadesBroken) {
    nowSpadesBroken = true;
  }

  // Build new trick
  const isFirstCard = state.currentTrick.cards.length === 0;
  const leadSuit = isFirstCard ? cardToPlay.suit : state.currentTrick.leadSuit;

  const newTrick: Trick = {
    ...state.currentTrick,
    leadSuit,
    cards: [
      ...state.currentTrick.cards,
      {
        position,
        card: cardToPlay,
        timestamp: Date.now(),
      },
    ],
  };

  // Check if trick completed (4 cards)
  if (newTrick.cards.length === 4) {
    const trickResult = evaluateTrickWinner(newTrick);
    const winner = trickResult.winner;
    const completedTrick: Trick = {
      ...newTrick,
      winner,
      winningCard: trickResult.winningCard,
    };

    const newTricksWon = {
      ...state.tricksWon,
      [winner]: (state.tricksWon[winner] || 0) + 1,
    };

    const updatedTracker = updateTrackerWithTrick(state.tracker, completedTrick);

    const completedTricksList = [...state.completedTricks, completedTrick];

    // Check if 13 tricks completed (end of round)
    if (completedTricksList.length === 13) {
      const scoringResult = calculateRoundScores({
        ...state,
        hands: updatedHands,
        currentTrick: completedTrick,
        completedTricks: completedTricksList,
        tricksWon: newTricksWon,
        spadesBroken: nowSpadesBroken || trickResult.brokeSpades,
        tracker: updatedTracker,
      });

      return {
        newState: {
          ...state,
          hands: updatedHands,
          currentTrick: completedTrick,
          completedTricks: completedTricksList,
          tricksWon: newTricksWon,
          spadesBroken: nowSpadesBroken || trickResult.brokeSpades,
          scores: scoringResult.teamScores,
          history: [...state.history, scoringResult.roundRecord],
          winner: scoringResult.winner,
          phase: scoringResult.winner ? 'game_over' : 'round_summary',
          turn: winner,
          tracker: updatedTracker,
          lastActionMessage: `${state.players[winner].name} won the final trick with ${trickResult.winningCard.rank} of ${trickResult.winningCard.suit}! Round finished.`,
        },
      };
    }

    // Normal trick finished: set phase to trick_won temporarily or assign turn to winner
    return {
      newState: {
        ...state,
        hands: updatedHands,
        currentTrick: completedTrick,
        completedTricks: completedTricksList,
        tricksWon: newTricksWon,
        spadesBroken: nowSpadesBroken || trickResult.brokeSpades,
        phase: 'trick_won',
        turn: winner,
        tracker: updatedTracker,
        lastActionMessage: `${state.players[winner].name} takes the trick with ${trickResult.winningCard.rank} of ${trickResult.winningCard.suit}!`,
      },
    };
  }

  // Still mid-trick: advance to next player
  const nextPlayer = getNextSeat(position);
  return {
    newState: {
      ...state,
      hands: updatedHands,
      currentTrick: newTrick,
      spadesBroken: nowSpadesBroken,
      turn: nextPlayer,
      lastActionMessage: `${state.players[position].name} played ${cardToPlay.rank} of ${cardToPlay.suit}. Next: ${state.players[nextPlayer].name}.`,
    },
  };
}

/**
 * Clears the won trick from table and starts the next trick.
 */
export function advanceToNextTrick(state: SpadesGameState): SpadesGameState {
  if (state.phase !== 'trick_won') return state;

  const winner = state.currentTrick.winner || state.turn;
  const nextTrickId = state.completedTricks.length + 1;

  return {
    ...state,
    phase: 'playing',
    turn: winner,
    currentTrick: {
      id: nextTrickId,
      cards: [],
    },
    lastActionMessage: `${state.players[winner].name} leads trick #${nextTrickId}.`,
  };
}
