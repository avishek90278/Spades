import { BotDifficulty, Card, CardTrackerState, Position, SpadesGameState, Suit, Trick } from '../types/spades';
import { getLegalMoves, getPartnerPosition, isMoveLegal } from './rules';
import { getUnseenCards } from './cardTracker';

export interface BotDecisionResult {
  card: Card;
  reasoning: string;
  metrics: {
    ruleApplied: string;
    evaluatedCandidates: { card: string; score: number }[];
    handAnalysis?: string;
  };
}

export interface BotBidResult {
  bid: number | 'nil' | 'blind_nil';
  reasoning: string;
}

/**
 * Calculates bot's bid based on difficulty level and hand strength.
 */
export function calculateBotBid(
  hand: Card[],
  position: Position,
  difficulty: BotDifficulty,
  gameState: SpadesGameState
): BotBidResult {
  const partnerPos = getPartnerPosition(position);
  const partnerBid = gameState.bids[partnerPos];
  const partnerIsNil = partnerBid?.bid === 'nil' || partnerBid?.bid === 'blind_nil';

  if (difficulty === 'easy') {
    // Easy: Simplistic count of Aces and Kings
    let count = hand.filter((c) => c.rank === 'A' || (c.rank === 'K' && c.suit === 'spades')).length;
    count = Math.max(1, Math.min(count + Math.floor(Math.random() * 2), 6));
    return { bid: count, reasoning: 'Basic estimation based on Aces.' };
  }

  if (difficulty === 'medium') {
    // Medium: Standard heuristic
    let expectedTricks = 0;
    const spades = hand.filter((c) => c.suit === 'spades');
    const hearts = hand.filter((c) => c.suit === 'hearts');
    const diamonds = hand.filter((c) => c.suit === 'diamonds');
    const clubs = hand.filter((c) => c.suit === 'clubs');

    const suits = [spades, hearts, diamonds, clubs];

    // High cards
    for (const s of suits) {
      if (s.some((c) => c.rank === 'A')) expectedTricks += 1.0;
      if (s.some((c) => c.rank === 'K') && s.length >= 2) expectedTricks += 0.8;
      if (s.some((c) => c.rank === 'Q') && s.length >= 3) expectedTricks += 0.4;
    }

    // Extra Spades
    if (spades.length > 3) {
      expectedTricks += (spades.length - 3) * 0.7;
    }

    const finalBid = Math.max(1, Math.round(expectedTricks));
    return {
      bid: finalBid,
      reasoning: `Medium heuristic estimated ${expectedTricks.toFixed(1)} books.`,
    };
  }

  // EXPERT BOT BIDDING LOGIC
  const spades = hand.filter((c) => c.suit === 'spades');
  const hearts = hand.filter((c) => c.suit === 'hearts');
  const diamonds = hand.filter((c) => c.suit === 'diamonds');
  const clubs = hand.filter((c) => c.suit === 'clubs');
  const nonSpadeSuits = [hearts, diamonds, clubs];

  // 1. Check for Safe Nil condition
  // Conditions: No Aces, no unprotected Kings/Queens, max spade <= 9, short spade length <= 3, low card majority
  const hasAces = hand.some((c) => c.rank === 'A');
  const dangerousKings = nonSpadeSuits.some((s) => s.length <= 2 && s.some((c) => c.rank === 'K'));
  const dangerousQueens = nonSpadeSuits.some((s) => s.length <= 2 && s.some((c) => c.rank === 'Q'));
  const highSpades = spades.some((c) => c.value >= 10);

  const canAttemptNil =
    !hasAces &&
    !dangerousKings &&
    !dangerousQueens &&
    !highSpades &&
    spades.length <= 3 &&
    !partnerIsNil; // Don't double Nil unless desperate

  if (canAttemptNil && Math.random() > 0.15) {
    return {
      bid: 'nil',
      reasoning: 'Expert evaluated high Nil safety: No Aces, low trump profile, and solid suit distribution.',
    };
  }

  // 2. Accurate Book Evaluation
  let bookExpectation = 0;

  // Ace evaluations
  for (const s of [spades, ...nonSpadeSuits]) {
    const hasA = s.some((c) => c.rank === 'A');
    const hasK = s.some((c) => c.rank === 'K');
    const hasQ = s.some((c) => c.rank === 'Q');

    if (hasA) bookExpectation += 1.0;
    if (hasK) {
      if (hasA) {
        bookExpectation += 0.95; // A+K combination in suit is nearly 2 guaranteed tricks
      } else if (s.length >= 2) {
        bookExpectation += 0.75; // Protected King
      } else {
        bookExpectation += 0.3; // Singleton King risk
      }
    }
    if (hasQ && hasA && hasK) {
      bookExpectation += 0.85; // A-K-Q tier
    } else if (hasQ && s.length >= 3) {
      bookExpectation += 0.35;
    }
  }

  // Trump length & ruffing power
  if (spades.length >= 4) {
    bookExpectation += (spades.length - 3) * 0.9;
  }

  // Voids or singletons in side suits allow early trump ruffing
  for (const s of nonSpadeSuits) {
    if (s.length === 0 && spades.length >= 3) {
      bookExpectation += 1.0; // Void allows instant ruffing
    } else if (s.length === 1 && spades.length >= 3) {
      bookExpectation += 0.6; // Singleton ruffing
    }
  }

  // If partner bid Nil, bot must step up and bid at least +1 book to proactively protect partner
  if (partnerIsNil) {
    bookExpectation += 1.2;
  }

  let finalBid = Math.max(1, Math.min(13, Math.round(bookExpectation)));

  return {
    bid: finalBid,
    reasoning: `Expert evaluated hand: ${bookExpectation.toFixed(2)} expected tricks (Trumps: ${spades.length}, Partner Nil coverage: ${partnerIsNil ? 'Active' : 'No'}).`,
  };
}

/**
 * Expert Bot Card Decision Engine.
 */
export function selectBotCard(
  position: Position,
  hand: Card[],
  gameState: SpadesGameState,
  difficulty: BotDifficulty
): BotDecisionResult {
  const { currentTrick, spadesBroken, tracker, bids, tricksWon } = gameState;
  const legalMoves = getLegalMoves(hand, currentTrick, spadesBroken);

  if (legalMoves.length === 1) {
    return {
      card: legalMoves[0],
      reasoning: 'Forced move (only 1 legal card available).',
      metrics: {
        ruleApplied: 'forced_single_legal_move',
        evaluatedCandidates: [{ card: legalMoves[0].id, score: 100 }],
      },
    };
  }

  const partnerPos = getPartnerPosition(position);
  const myBid = bids[position];
  const partnerBid = bids[partnerPos];
  const isMyNil = myBid?.bid === 'nil' || myBid?.bid === 'blind_nil';
  const isPartnerNil = partnerBid?.bid === 'nil' || partnerBid?.bid === 'blind_nil';

  // --- EASY BOT ---
  if (difficulty === 'easy') {
    // Random legal move or simple lowest card
    const randomCard = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return {
      card: randomCard,
      reasoning: 'Casual move.',
      metrics: {
        ruleApplied: 'easy_casual_selection',
        evaluatedCandidates: legalMoves.map((c) => ({ card: c.id, score: 50 })),
      },
    };
  }

  // --- MEDIUM BOT ---
  if (difficulty === 'medium') {
    // Basic heuristic: Win if leading with high card, or follow low
    if (currentTrick.cards.length === 0) {
      // Lead highest non-spade
      const nonSpades = legalMoves.filter((c) => c.suit !== 'spades');
      const sorted = (nonSpades.length > 0 ? nonSpades : legalMoves).sort((a, b) => b.value - a.value);
      return {
        card: sorted[0],
        reasoning: 'Medium bot leading highest playable card.',
        metrics: {
          ruleApplied: 'medium_lead_high',
          evaluatedCandidates: sorted.map((c) => ({ card: c.id, score: c.value })),
        },
      };
    } else {
      // Follow suit
      const leadSuit = currentTrick.leadSuit || currentTrick.cards[0].card.suit;
      const suitCards = legalMoves.filter((c) => c.suit === leadSuit).sort((a, b) => b.value - a.value);
      const chosen = suitCards.length > 0 ? suitCards[0] : legalMoves.sort((a, b) => a.value - b.value)[0];
      return {
        card: chosen,
        reasoning: 'Medium bot following suit.',
        metrics: {
          ruleApplied: 'medium_follow_suit',
          evaluatedCandidates: [{ card: chosen.id, score: chosen.value }],
        },
      };
    }
  }

  // --- EXPERT BOT ALGORITHM ---
  // Calculates best card with heuristic evaluations, partner Nil protection, bag forcing, and card counting.
  const scoredMoves = legalMoves.map((card) => {
    let score = 0;
    const reasons: string[] = [];

    const isLeading = currentTrick.cards.length === 0;

    // A. Nil Protection (Self or Partner)
    if (isMyNil) {
      // Self Nil: MUST NOT WIN TRICK! Play lowest possible card
      score += 1000 - card.value * 20; // lower card = much higher score
      if (card.suit === 'spades') score -= 200; // avoid playing trumps if possible
      reasons.push('Self-Nil: minimizing card value to duck trick');
    }

    if (isPartnerNil) {
      // Partner Nil: We must win the trick if partner might be in danger of taking it
      const partnerCardPlayed = currentTrick.cards.find((c) => c.position === partnerPos);
      if (partnerCardPlayed) {
        // Partner already played
        const currentWinner = getCurrentTrickWinner(currentTrick);
        if (currentWinner?.position === partnerPos) {
          // PARTNER IS WINNING! URGENT: We must overtake partner if possible!
          if (canCardBeat(card, partnerCardPlayed.card, currentTrick.leadSuit)) {
            score += 2500 + card.value * 10; // high priority to overtake
            reasons.push('Partner-Nil Rescue: overtaking partner winning card!');
          }
        }
      }
    }

    // B. Leading Phase Strategies
    if (isLeading) {
      // 1. Boss card leads (Aces)
      if (card.rank === 'A' && card.suit !== 'spades') {
        const opponentVoid = isOpponentVoid(card.suit, position, tracker);
        if (!opponentVoid) {
          score += 600; // Safe Ace lead
          reasons.push('Safe Ace lead on non-void opponents');
        } else {
          score += 100; // Risk of getting ruffed by opponent
          reasons.push('Ace lead with ruff risk');
        }
      }

      // 2. Trump extraction: If we hold high spades and spades broken, pull out opponent trumps
      if (card.suit === 'spades' && spadesBroken && card.value >= 12 && tracker.remainingSpades > hand.filter((c) => c.suit === 'spades').length) {
        score += 450;
        reasons.push('Extracting opponent trumps with high spade');
      }

      // 3. Short suit stripping: Lead low singleton/doubleton to setup void for ruffing
      const suitLength = hand.filter((c) => c.suit === card.suit).length;
      if (suitLength <= 2 && card.suit !== 'spades' && hand.filter((c) => c.suit === 'spades').length >= 3) {
        score += 350 - card.value * 10; // lead lowest in short suit
        reasons.push('Leading short suit to establish void for ruffing');
      }

      // 4. If opponent already met bid, force bags by leading low cards
      if (areOpponentsNearBagPenalty(position, gameState)) {
        if (card.value <= 6) {
          score += 200;
          reasons.push('Bag-forcing tactic: leading low junk');
        }
      }
    } else {
      // C. Following / Answering Phase Strategies
      const leadSuit = currentTrick.leadSuit || currentTrick.cards[0].card.suit;
      const currentWinner = getCurrentTrickWinner(currentTrick);
      const isPartnerWinning = currentWinner?.position === partnerPos;

      if (isPartnerWinning && !isPartnerNil) {
        // Partner is winning!
        const isPartnerBoss = currentWinner.winningCard.rank === 'A' || currentWinner.winningCard.suit === 'spades';
        if (isPartnerBoss) {
          // Partner has it locked: Duck with lowest card!
          score += 500 - card.value * 15;
          reasons.push('Partner has trick locked: ducking with lowest card');
        } else {
          // Partner has moderate card: Duck or reinforce if opponents might beat
          score += 300 - card.value * 10;
          reasons.push('Partner winning: conserving high cards');
        }
      } else {
        // Opponent is winning or partner is Nil
        const beatsWinner = canCardBeat(card, currentWinner?.winningCard, leadSuit);

        if (beatsWinner) {
          // Winning card: We want the MINIMUM winning card to not waste high ranks!
          score += 700 - card.value * 5;
          if (card.suit === 'spades' && leadSuit !== 'spades') {
            score += 150; // Ruffing with trump
            reasons.push('Ruffing opponent trick with minimal trump');
          } else {
            reasons.push('Beating opponent with minimal winning card');
          }
        } else {
          // Cannot win trick: Slough lowest trash card
          score += 400 - card.value * 12;
          if (card.suit !== 'spades') {
            score += 100; // prioritize throwing away non-trump junk
          }
          reasons.push('Dumping lowest off-suit card');
        }
      }
    }

    return {
      card,
      score,
      reason: reasons.join('; ') || 'Optimal strategic weight.',
    };
  });

  // Sort candidates by highest score
  scoredMoves.sort((a, b) => b.score - a.score);
  const bestMove = scoredMoves[0];

  return {
    card: bestMove.card,
    reasoning: bestMove.reason,
    metrics: {
      ruleApplied: 'expert_decision_engine',
      evaluatedCandidates: scoredMoves.map((m) => ({
        card: `${m.card.rank}${m.card.suit[0].toUpperCase()}`,
        score: Math.round(m.score),
      })),
      handAnalysis: `Remaining trumps: ${tracker.remainingSpades}, Spades broken: ${spadesBroken}`,
    },
  };
}

// Helpers
function getCurrentTrickWinner(trick: Trick): { position: Position; winningCard: Card } | null {
  if (trick.cards.length === 0) return null;
  const leadCard = trick.cards[0].card;
  const leadSuit = trick.leadSuit || leadCard.suit;

  let bestCard = leadCard;
  let winnerPos = trick.cards[0].position;

  for (let i = 1; i < trick.cards.length; i++) {
    const { position, card } = trick.cards[i];
    if (card.suit === 'spades') {
      if (bestCard.suit !== 'spades' || card.value > bestCard.value) {
        bestCard = card;
        winnerPos = position;
      }
    } else if (card.suit === leadSuit && bestCard.suit !== 'spades') {
      if (card.value > bestCard.value) {
        bestCard = card;
        winnerPos = position;
      }
    }
  }

  return { position: winnerPos, winningCard: bestCard };
}

function canCardBeat(card: Card, targetCard?: Card, leadSuit?: Suit): boolean {
  if (!targetCard) return true;
  if (card.suit === 'spades') {
    if (targetCard.suit !== 'spades') return true;
    return card.value > targetCard.value;
  }
  if (card.suit === leadSuit) {
    if (targetCard.suit === 'spades') return false;
    if (targetCard.suit === leadSuit) return card.value > targetCard.value;
    return true;
  }
  return false;
}

function isOpponentVoid(suit: Suit, myPos: Position, tracker: CardTrackerState): boolean {
  const opponents: Position[] = myPos === 'north' || myPos === 'south' ? ['east', 'west'] : ['north', 'south'];
  return opponents.some((opp) => tracker.playerKnownVoids[opp]?.[suit] === true);
}

function areOpponentsNearBagPenalty(myPos: Position, gameState: SpadesGameState): boolean {
  const oppTeamKey = myPos === 'north' || myPos === 'south' ? 'team_east_west' : 'team_north_south';
  const oppScore = gameState.scores[oppTeamKey];
  return oppScore.bags >= 7; // Opponents have 7+ bags and close to penalty
}
