const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3384;

app.use(express.json());

// config
const VOLUME = 0.8;
const DELAY_BETWEEN_SOUNDS = 400;

const KILL_SOUND = 'sounds/kill.mp3';
const DEATH_SOUND = 'sounds/death.mp3';

let lastRoundKills = 0;
let soundQueue = [];
let isPlaying = false;

function playNextSound() {
  if (soundQueue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;
  const sound = soundQueue.shift();

  const ffplay = spawn('ffplay', [
    '-nodisp',
    '-autoexit',
    '-volume', String(VOLUME * 100),
    sound
  ]);

  ffplay.on('exit', () => {
    setTimeout(playNextSound, DELAY_BETWEEN_SOUNDS);
  });

  ffplay.on('error', (err) => {
    console.error(`Failed to play sound: ${err.message}`);
    setTimeout(playNextSound, DELAY_BETWEEN_SOUNDS);
  });
}

app.post('/', (req, res) => {
  const payload = req.body;
  const playerState = payload?.player?.state;
  const previousState = payload?.previously?.player?.state;

  // kill detection
  if (playerState && typeof playerState.round_kills === 'number') {
    if (playerState.round_kills > lastRoundKills) {
      const gained = playerState.round_kills - lastRoundKills;
      console.log(`🟢 you got a kill`);

      for (let i = 0; i < gained; i++) {
        soundQueue.push(KILL_SOUND);
      }

      lastRoundKills = playerState.round_kills;

      if (!isPlaying) playNextSound();
    } else if (playerState.round_kills < lastRoundKills) {
      // probably new round
      lastRoundKills = playerState.round_kills;
    }
  }

  // death detection
  if (previousState && playerState) {
    const wasAliveBefore = previousState.health > 0;
    const isDeadNow = playerState.health === 0;

    if (wasAliveBefore && isDeadNow) {
      console.log(`🔴 you died`);
      soundQueue.push(DEATH_SOUND);
      if (!isPlaying) playNextSound();
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});