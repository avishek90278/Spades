import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { ConnectedClient, gameManager } from './server/gameManager';
import { WSClientAction } from './src/types/spades';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // WebSocket Server attached to the HTTP server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const clientId = 'user_' + Math.random().toString(36).substring(2, 9);
    let clientObj: ConnectedClient = {
      id: clientId,
      ws,
      playerName: 'Player',
      avatar: '👑',
    };

    gameManager.clients.set(clientId, clientObj);

    ws.on('message', (data: string) => {
      try {
        const action: WSClientAction = JSON.parse(data.toString());

        switch (action.type) {
          case 'create_room': {
            clientObj.playerName = action.playerName || 'Host';
            clientObj.avatar = action.avatar || '👑';
            const room = gameManager.createRoom(clientObj, clientObj.playerName, clientObj.avatar);
            ws.send(
              JSON.stringify({
                type: 'room_joined',
                roomCode: room.code,
                position: 'south',
                playerId: clientId,
              })
            );
            room.broadcastState();
            break;
          }

          case 'join_room': {
            clientObj.playerName = action.playerName || 'Guest';
            clientObj.avatar = action.avatar || '⭐';
            const room = gameManager.getRoom(action.roomCode);
            if (!room) {
              ws.send(JSON.stringify({ type: 'error', message: 'Room code not found.' }));
              return;
            }
            const seat = room.joinClient(clientObj);
            ws.send(
              JSON.stringify({
                type: 'room_joined',
                roomCode: room.code,
                position: seat,
                playerId: clientId,
              })
            );
            break;
          }

          case 'join_seat': {
            if (!clientObj.roomCode) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              const assigned = room.joinClient(clientObj, action.position);
              clientObj.position = assigned;
            }
            break;
          }

          case 'set_seat_bot': {
            if (!clientObj.roomCode) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              room.setSeatBot(action.position, action.difficulty);
            }
            break;
          }

          case 'start_game': {
            if (!clientObj.roomCode) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              room.startGame();
            }
            break;
          }

          case 'place_bid': {
            if (!clientObj.roomCode || !clientObj.position) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              room.handleBid(clientObj.position, action.bid, action.isBlindNil);
            }
            break;
          }

          case 'play_card': {
            if (!clientObj.roomCode || !clientObj.position) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              room.handlePlayCard(clientObj.position, action.cardId);
            }
            break;
          }

          case 'next_round': {
            if (!clientObj.roomCode) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room) {
              room.nextRound();
            }
            break;
          }

          case 'send_chat': {
            if (!clientObj.roomCode) return;
            const room = gameManager.getRoom(clientObj.roomCode);
            if (room && clientObj.position) {
              room.broadcast({
                type: 'chat_broadcast',
                sender: clientObj.playerName,
                position: clientObj.position,
                message: action.message,
                emoji: action.emoji,
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'join_matchmaking': {
            clientObj.playerName = action.playerName || 'Contender';
            clientObj.avatar = action.avatar || '⚡';
            gameManager.joinMatchmaking(clientObj);
            break;
          }

          case 'leave_matchmaking': {
            gameManager.leaveMatchmaking(clientId);
            break;
          }
        }
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    });

    ws.on('close', () => {
      gameManager.leaveMatchmaking(clientId);
      if (clientObj.roomCode) {
        const room = gameManager.getRoom(clientObj.roomCode);
        if (room) {
          room.removeClient(clientId);
        }
      }
      gameManager.clients.delete(clientId);
    });
  });

  // Health API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      activeRooms: gameManager.rooms.size,
      matchmakingQueue: gameManager.matchmakingQueue.length,
      connectedClients: gameManager.clients.size,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Spades Master Server running on port ${PORT}`);
  });
}

startServer();
