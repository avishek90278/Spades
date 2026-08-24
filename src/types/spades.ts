export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string; // e.g. "spades-A"
  suit: Suit;
  rank: Rank;
  value: number; // 2 through 14
}

export type Position = 'north' | 'east' | 'south' | 'west';

export type TeamId = 'team_north_south' | 'team_east_west';

export type PlayerType = 'human' | 'bot';
export type BotDifficulty = 'easy' | 'medium' | 'expert';

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: TeamId;
  type: PlayerType;
  botDifficulty?: BotDifficulty;
  avatar: string;
  isReady?: boolean;
  connected?: boolean;
}

export type BidValue = number | 'nil' | 'blind_nil';

export interface PlayerBid {
  position: Position;
  bid: BidValue;
  isBlindNil: boolean;
}

export interface PlayedCard {
  position: Position;
  card: Card;
  timestamp: number;
}

export interface Trick {
  id: number;
  leadSuit?: Suit;
  cards: PlayedCard[];
  winner?: Position;
  winningCard?: Card;
}

export type CompletedTrick = Trick;

export type GamePhase = 
  | 'lobby' 
  | 'dealing' 
  | 'bidding' 
  | 'playing' 
  | 'trick_won' 
  | 'round_summary' 
  | 'game_over';

export interface TeamScore {
  teamId: TeamId;
  name: string;
  totalScore: number;
  bags: number;
  totalBagsAccumulated: number;
  bagPenalties: number;
  roundBids: {
    totalBid: number;
    nilBids: { position: Position; isBlind: boolean }[];
  };
  roundTricks: number;
  roundScoreChange: number;
}

export interface RoundScoreRecord {
  roundNumber: number;
  teamNorthSouth: {
    bid: number;
    tricks: number;
    score: number;
    bags: number;
    bagPenalty: boolean;
    nilSuccess?: boolean;
    nilFailed?: boolean;
  };
  teamEastWest: {
    bid: number;
    tricks: number;
    score: number;
    bags: number;
    bagPenalty: boolean;
    nilSuccess?: boolean;
    nilFailed?: boolean;
  };
}

export interface GameSettings {
  targetScore: number; // 500 default, 300 short
  allowBlindNil: boolean;
  blindNilBonus: number; // +200 / -200
  nilBonus: number; // +100 / -100
  bagPenaltyThreshold: number; // 10 bags = -100
  bagPenaltyValue: number; // 100
  botSpeedMs: number; // 800ms
  allowRenegingPenalty: boolean;
}

export interface CardTrackerState {
  remainingSpades: number;
  spadesBroken: boolean;
  playedCards: Card[];
  unplayedAces: { [key in Suit]: boolean };
  unplayedKings: { [key in Suit]: boolean };
  playerKnownVoids: { [key in Position]: { [suit in Suit]: boolean } };
}

export interface SpadesGameState {
  id: string;
  roomCode?: string;
  mode: 'single_player' | 'room' | 'matchmaking';
  phase: GamePhase;
  dealer: Position;
  turn: Position;
  roundNumber: number;
  players: { [key in Position]: Player };
  hands: { [key in Position]: Card[] };
  initialHands?: { [key in Position]: Card[] };
  bids: { [key in Position]?: PlayerBid };
  currentTrick: Trick;
  completedTricks: Trick[];
  tricksWon: { [key in Position]: number };
  spadesBroken: boolean;
  scores: {
    team_north_south: TeamScore;
    team_east_west: TeamScore;
  };
  history: RoundScoreRecord[];
  winner?: TeamId;
  settings: GameSettings;
  tracker: CardTrackerState;
  lastActionMessage?: string;
  aiExplanation?: {
    position: Position;
    reasoning: string;
    metrics: Record<string, any>;
  };
}

export type WSClientAction =
  | { type: 'join_room'; roomCode: string; playerName: string; avatar?: string }
  | { type: 'create_room'; playerName: string; avatar?: string; settings?: Partial<GameSettings> }
  | { type: 'join_seat'; position: Position }
  | { type: 'set_seat_bot'; position: Position; difficulty: BotDifficulty }
  | { type: 'start_game' }
  | { type: 'place_bid'; bid: BidValue; isBlindNil?: boolean }
  | { type: 'play_card'; cardId: string }
  | { type: 'next_round' }
  | { type: 'restart_game' }
  | { type: 'send_chat'; message: string; emoji?: string }
  | { type: 'join_matchmaking'; playerName: string; avatar?: string }
  | { type: 'leave_matchmaking' };

export type WSServerMessage =
  | { type: 'state_update'; state: SpadesGameState }
  | { type: 'room_joined'; roomCode: string; position: Position; playerId: string }
  | { type: 'matchmaking_waiting'; queueSize: number }
  | { type: 'matchmaking_found'; roomCode: string }
  | { type: 'chat_broadcast'; sender: string; position: Position; message: string; emoji?: string; timestamp: number }
  | { type: 'error'; message: string };
