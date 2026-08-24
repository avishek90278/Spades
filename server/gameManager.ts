import { WebSocket } from 'ws';
import {
  BidValue,
  BotDifficulty,
  Position,
  SpadesGameState,
  WSClientAction,
  WSServerMessage,
} from '../src/types/spades';
import {
  advanceToNextTrick,
  createDefaultPlayers,
  createInitialGameState,
  DEFAULT_SETTINGS,
  placePlayerBid,
  playCardMove,
  startNewRound,
} from '../src/engine/spadesGame';
import { calculateBotBid, selectBotCard } from '../src/engine/botAI';

export interface ConnectedClient {
  id: string;
  ws: WebSocket;
  playerName: string;
  avatar: string;
  roomCode?: string;
  position?: Position;
}

export class SpadesRoom {
  code: string;
  state: SpadesGameState;
  clients: Map<string, ConnectedClient> = new Map();
  botTimer: NodeJS.Timeout | null = null;

  constructor(code: string, hostName: string, hostAvatar: string = '👑') {
    this.code = code;
    this.state = createInitialGameState(code, 'room', code);

    // Set South as human host
    this.state.players.south = {
      id: 'host',
      name: hostName,
      position: 'south',
      team: 'team_north_south',
      type: 'human',
      avatar: hostAvatar,
      isReady: true,
      connected: true,
    };
  }

  broadcast(message: WSServerMessage) {
    const data = JSON.stringify(message);
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }

  broadcastState() {
    this.broadcast({
      type: 'state_update',
      state: this.state,
    });
  }

  joinClient(client: ConnectedClient, requestedPos?: Position): Position {
    this.clients.set(client.id, client);
    client.roomCode = this.code;

    // Pick requested seat or first available seat
    const positions: Position[] = ['south', 'north', 'east', 'west'];
    let targetPos = requestedPos;

    if (!targetPos || (this.state.players[targetPos].type === 'human' && this.state.players[targetPos].id !== client.id)) {
      targetPos = positions.find((p) => this.state.players[p].type === 'bot' || !this.state.players[p].connected) || 'south';
    }

    client.position = targetPos;

    this.state.players[targetPos] = {
      id: client.id,
      name: client.playerName,
      position: targetPos,
      team: targetPos === 'north' || targetPos === 'south' ? 'team_north_south' : 'team_east_west',
      type: 'human',
      avatar: client.avatar || '⭐',
      isReady: true,
      connected: true,
    };

    this.broadcastState();
    return targetPos;
  }

  removeClient(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (client.position) {
      const pos = client.position;
      // Convert disconnected seat to Expert Bot so game is never stuck
      this.state.players[pos] = {
        ...this.state.players[pos],
        type: 'bot',
        name: `${this.state.players[pos].name} (AI Bot)`,
        botDifficulty: 'expert',
        connected: false,
      };
    }

    this.clients.delete(clientId);
    this.broadcastState();
    this.checkAndTriggerBot();
  }

  setSeatBot(position: Position, difficulty: BotDifficulty) {
    this.state.players[position] = {
      id: `bot_${position}`,
      name: `${position.toUpperCase()} (${difficulty.toUpperCase()} AI)`,
      position,
      team: position === 'north' || position === 'south' ? 'team_north_south' : 'team_east_west',
      type: 'bot',
      botDifficulty: difficulty,
      avatar: difficulty === 'expert' ? '🧠' : difficulty === 'medium' ? '🤖' : '🌱',
      isReady: true,
      connected: true,
    };
    this.broadcastState();
  }

  startGame() {
    this.state = startNewRound(this.state);
    this.broadcastState();
    this.checkAndTriggerBot();
  }

  nextRound() {
    this.state = startNewRound(this.state);
    this.broadcastState();
    this.checkAndTriggerBot();
  }

  handleBid(position: Position, bid: BidValue, isBlindNil: boolean = false) {
    const result = placePlayerBid(this.state, position, bid, isBlindNil);
    if (result.error) return;

    this.state = result.newState;
    this.broadcastState();
    this.checkAndTriggerBot();
  }

  handlePlayCard(position: Position, cardId: string) {
    const result = playCardMove(this.state, position, cardId);
    if (result.error) return;

    this.state = result.newState;
    this.broadcastState();

    if (this.state.phase === 'trick_won') {
      // Auto clear trick after a brief pause
      setTimeout(() => {
        if (this.state.phase === 'trick_won') {
          this.state = advanceToNextTrick(this.state);
          this.broadcastState();
          this.checkAndTriggerBot();
        }
      }, 1400);
    } else {
      this.checkAndTriggerBot();
    }
  }

  checkAndTriggerBot() {
    if (this.botTimer) clearTimeout(this.botTimer);

    if (this.state.phase !== 'bidding' && this.state.phase !== 'playing') {
      return;
    }

    const currentTurn = this.state.turn;
    const player = this.state.players[currentTurn];

    if (player.type === 'bot') {
      const delay = this.state.settings.botSpeedMs || 700;
      this.botTimer = setTimeout(() => {
        this.executeBotTurn(currentTurn);
      }, delay);
    }
  }

  executeBotTurn(position: Position) {
    const player = this.state.players[position];
    if (player.type !== 'bot') return;

    const difficulty = player.botDifficulty || 'expert';

    if (this.state.phase === 'bidding') {
      const hand = this.state.hands[position];
      const botBid = calculateBotBid(hand, position, difficulty, this.state);
      this.state.aiExplanation = {
        position,
        reasoning: botBid.reasoning,
        metrics: { difficulty, bid: botBid.bid },
      };
      this.handleBid(position, botBid.bid);
    } else if (this.state.phase === 'playing') {
      const hand = this.state.hands[position];
      const decision = selectBotCard(position, hand, this.state, difficulty);
      this.state.aiExplanation = {
        position,
        reasoning: decision.reasoning,
        metrics: decision.metrics,
      };
      this.handlePlayCard(position, decision.card.id);
    }
  }
}

export class GameManager {
  rooms: Map<string, SpadesRoom> = new Map();
  clients: Map<string, ConnectedClient> = new Map();
  matchmakingQueue: ConnectedClient[] = [];

  createRoom(hostClient: ConnectedClient, hostName: string, hostAvatar?: string): SpadesRoom {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = new SpadesRoom(code, hostName, hostAvatar);
    this.rooms.set(code, room);
    room.joinClient(hostClient, 'south');
    return room;
  }

  getRoom(code: string): SpadesRoom | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  joinMatchmaking(client: ConnectedClient) {
    if (!this.matchmakingQueue.some((c) => c.id === client.id)) {
      this.matchmakingQueue.push(client);
    }

    // Notify queue status
    client.ws.send(
      JSON.stringify({
        type: 'matchmaking_waiting',
        queueSize: this.matchmakingQueue.length,
      })
    );

    // If 4 or more players in queue, spawn a match!
    if (this.matchmakingQueue.length >= 4) {
      const matched = this.matchmakingQueue.splice(0, 4);
      const code = 'MATCH-' + Math.floor(1000 + Math.random() * 9000);
      const host = matched[0];
      const room = new SpadesRoom(code, host.playerName, host.avatar);
      this.rooms.set(code, room);

      const seats: Position[] = ['south', 'north', 'east', 'west'];
      matched.forEach((c, idx) => {
        room.joinClient(c, seats[idx]);
        c.ws.send(JSON.stringify({ type: 'matchmaking_found', roomCode: code }));
      });

      room.startGame();
    }
  }

  leaveMatchmaking(clientId: string) {
    this.matchmakingQueue = this.matchmakingQueue.filter((c) => c.id !== clientId);
  }
}

export const gameManager = new GameManager();
