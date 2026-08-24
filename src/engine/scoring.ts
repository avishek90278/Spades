import { GameSettings, Position, RoundScoreRecord, SpadesGameState, TeamId, TeamScore } from '../types/spades';
import { getPartnerPosition } from './rules';

export interface CalculatedRoundScore {
  teamScores: {
    team_north_south: TeamScore;
    team_east_west: TeamScore;
  };
  roundRecord: RoundScoreRecord;
  winner?: TeamId;
}

/**
 * Calculates end-of-round scores, updates bags, applies bag penalties, and checks victory.
 */
export function calculateRoundScores(state: SpadesGameState): CalculatedRoundScore {
  const { bids, tricksWon, scores, settings, roundNumber } = state;

  const positionsNorthSouth: Position[] = ['north', 'south'];
  const positionsEastWest: Position[] = ['east', 'west'];

  function processTeam(
    teamId: TeamId,
    positions: Position[],
    prevScore: TeamScore
  ) {
    const p1 = positions[0];
    const p2 = positions[1];

    const bid1 = bids[p1];
    const bid2 = bids[p2];

    const p1IsNil = bid1?.bid === 'nil' || bid1?.bid === 'blind_nil' || bid1?.bid === 0;
    const p1IsBlind = bid1?.isBlindNil || bid1?.bid === 'blind_nil';

    const p2IsNil = bid2?.bid === 'nil' || bid2?.bid === 'blind_nil' || bid2?.bid === 0;
    const p2IsBlind = bid2?.isBlindNil || bid2?.bid === 'blind_nil';

    const t1 = tricksWon[p1] || 0;
    const t2 = tricksWon[p2] || 0;
    const totalTricks = t1 + t2;

    let standardBidTotal = 0;
    if (!p1IsNil && typeof bid1?.bid === 'number') standardBidTotal += bid1.bid;
    if (!p2IsNil && typeof bid2?.bid === 'number') standardBidTotal += bid2.bid;

    let roundDelta = 0;
    let roundBags = 0;
    let nilSuccessP1: boolean | undefined;
    let nilSuccessP2: boolean | undefined;

    // 1. Process P1 Nil
    if (p1IsNil) {
      if (t1 === 0) {
        // Made Nil
        const bonus = p1IsBlind ? settings.blindNilBonus : settings.nilBonus;
        roundDelta += bonus;
        nilSuccessP1 = true;
      } else {
        // Failed Nil
        const penalty = p1IsBlind ? settings.blindNilBonus : settings.nilBonus;
        roundDelta -= penalty;
        nilSuccessP1 = false;
      }
    }

    // 2. Process P2 Nil
    if (p2IsNil) {
      if (t2 === 0) {
        // Made Nil
        const bonus = p2IsBlind ? settings.blindNilBonus : settings.nilBonus;
        roundDelta += bonus;
        nilSuccessP2 = true;
      } else {
        // Failed Nil
        const penalty = p2IsBlind ? settings.blindNilBonus : settings.nilBonus;
        roundDelta -= penalty;
        nilSuccessP2 = false;
      }
    }

    // 3. Process Standard Team Bid (if any player made standard bid)
    let teamTricksForStandard = 0;
    if (p1IsNil && p2IsNil) {
      // Both bid nil: any tricks they took are considered extra
      teamTricksForStandard = 0;
      roundBags = totalTricks; // all tricks are bags
    } else if (p1IsNil && !p2IsNil) {
      // Only P2 bid standard: P2's goal is to make standardBidTotal with t2 (or helper tricks)
      teamTricksForStandard = totalTricks;
      if (teamTricksForStandard >= standardBidTotal) {
        roundDelta += standardBidTotal * 10;
        roundBags = teamTricksForStandard - standardBidTotal;
        roundDelta += roundBags * 1;
      } else {
        // Set / failed
        roundDelta -= standardBidTotal * 10;
        roundBags = 0;
      }
    } else if (!p1IsNil && p2IsNil) {
      // Only P1 bid standard
      teamTricksForStandard = totalTricks;
      if (teamTricksForStandard >= standardBidTotal) {
        roundDelta += standardBidTotal * 10;
        roundBags = teamTricksForStandard - standardBidTotal;
        roundDelta += roundBags * 1;
      } else {
        roundDelta -= standardBidTotal * 10;
        roundBags = 0;
      }
    } else {
      // Both bid standard books
      teamTricksForStandard = totalTricks;
      if (teamTricksForStandard >= standardBidTotal) {
        roundDelta += standardBidTotal * 10;
        roundBags = teamTricksForStandard - standardBidTotal;
        roundDelta += roundBags * 1; // 1 point per bag
      } else {
        // Failed bid (Set)
        roundDelta -= standardBidTotal * 10;
        roundBags = 0;
      }
    }

    // 4. Update Bag Tracking & Bag Penalty Check
    let currentBags = prevScore.bags + roundBags;
    let bagPenaltiesCount = 0;
    let bagPenaltyApplied = false;

    if (currentBags >= settings.bagPenaltyThreshold) {
      const penalties = Math.floor(currentBags / settings.bagPenaltyThreshold);
      bagPenaltiesCount = penalties;
      roundDelta -= penalties * settings.bagPenaltyValue;
      currentBags = currentBags % settings.bagPenaltyThreshold;
      bagPenaltyApplied = true;
    }

    const newTotalScore = prevScore.totalScore + roundDelta;

    const updatedTeamScore: TeamScore = {
      teamId,
      name: prevScore.name,
      totalScore: newTotalScore,
      bags: currentBags,
      totalBagsAccumulated: prevScore.totalBagsAccumulated + roundBags,
      bagPenalties: prevScore.bagPenalties + bagPenaltiesCount,
      roundBids: {
        totalBid: standardBidTotal,
        nilBids: [
          ...(p1IsNil ? [{ position: p1, isBlind: !!p1IsBlind }] : []),
          ...(p2IsNil ? [{ position: p2, isBlind: !!p2IsBlind }] : []),
        ],
      },
      roundTricks: totalTricks,
      roundScoreChange: roundDelta,
    };

    return {
      updatedTeamScore,
      roundBags,
      roundDelta,
      standardBidTotal,
      totalTricks,
      bagPenaltyApplied,
      nilSuccess: p1IsNil ? nilSuccessP1 : p2IsNil ? nilSuccessP2 : undefined,
    };
  }

  const resNS = processTeam('team_north_south', positionsNorthSouth, scores.team_north_south);
  const resEW = processTeam('team_east_west', positionsEastWest, scores.team_east_west);

  const roundRecord: RoundScoreRecord = {
    roundNumber,
    teamNorthSouth: {
      bid: resNS.standardBidTotal,
      tricks: resNS.totalTricks,
      score: resNS.roundDelta,
      bags: resNS.roundBags,
      bagPenalty: resNS.bagPenaltyApplied,
      nilSuccess: resNS.nilSuccess === true,
      nilFailed: resNS.nilSuccess === false,
    },
    teamEastWest: {
      bid: resEW.standardBidTotal,
      tricks: resEW.totalTricks,
      score: resEW.roundDelta,
      bags: resEW.roundBags,
      bagPenalty: resEW.bagPenaltyApplied,
      nilSuccess: resEW.nilSuccess === true,
      nilFailed: resEW.nilSuccess === false,
    },
  };

  // Check Win condition
  const scoreNS = resNS.updatedTeamScore.totalScore;
  const scoreEW = resEW.updatedTeamScore.totalScore;
  let winner: TeamId | undefined;

  const target = settings.targetScore;

  if (scoreNS >= target || scoreEW >= target) {
    if (scoreNS > scoreEW) {
      winner = 'team_north_south';
    } else if (scoreEW > scoreNS) {
      winner = 'team_east_west';
    } else {
      // Tie breaker - extra round if equal
      winner = undefined;
    }
  }

  // Mercy rule: if one team is at -200 and opponent is positive
  if (scoreNS <= -200 && scoreEW > scoreNS) {
    winner = 'team_east_west';
  } else if (scoreEW <= -200 && scoreNS > scoreEW) {
    winner = 'team_north_south';
  }

  return {
    teamScores: {
      team_north_south: resNS.updatedTeamScore,
      team_east_west: resEW.updatedTeamScore,
    },
    roundRecord,
    winner,
  };
}
