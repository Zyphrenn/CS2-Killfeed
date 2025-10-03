const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3384;

app.use(express.json());

const config = require('./config.json');

const VOLUME = config.volume || 0.8;
const DELAY_BETWEEN_SOUNDS = config.delayBetweenSounds || 400;
const KILL_PREFIX = config.killPrefix || 'kill_';
const DEATH_PREFIX = config.deathPrefix || 'death_';
const NO_REPEAT = config.noRepeat || false;

let initialized = false;
let steamId = null;
let lastRoundKills = 0;
let soundQueue = [];
let isPlaying = false;
let lastSoundPlayed = null;

function getRandomSound(prefix) {
    const files = fs.readdirSync(config.soundsFolder);
    const matching = files.filter(f => f.startsWith(prefix));

    if (matching.length === 0) return null;

    let selected;
    if (NO_REPEAT && matching.length > 1) {
        const filtered = matching.filter(f => path.join(config.soundsFolder, f) !== lastSoundPlayed);
        selected = filtered.length > 0
            ? filtered[Math.floor(Math.random() * filtered.length)]
            : matching[Math.floor(Math.random() * matching.length)];
    } else {
        selected = matching[Math.floor(Math.random() * matching.length)];
    }

    return path.join(config.soundsFolder, selected);
}

function playNextSound() {
    if (soundQueue.length === 0) {
        isPlaying = false;
        return;
    }

    isPlaying = true;
    const sound = soundQueue.shift();
    lastSoundPlayed = sound;

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

    if (!payload.player || !payload.player.state) {
        if (!initialized) {
            console.log("Waiting for player state... (if this doesn't finish, try restarting the script)");
        }
        return res.sendStatus(200);
    }

    const player = payload?.player;
    const playerState = payload?.player?.state;
    const previousState = payload?.previously?.player?.state;
    
    if (!steamId && player?.steamid) {
        steamId = player.steamid;
        console.log("Tracking player:", steamId);
    }

    if (player?.steamid !== steamId) {
        return res.sendStatus(200);
    }

    if (!initialized) {
        lastRoundKills = playerState.round_kills || 0;
        initialized = true;
        console.log("Player state initialized:", lastRoundKills);
    }

    // kill detection
    if (playerState && typeof playerState.round_kills === 'number') {
        if (playerState.round_kills > lastRoundKills) {
            const gained = playerState.round_kills - lastRoundKills;
            console.log(`you got a kill`);

            for (let i = 0; i < gained; i++) {
                const sound = getRandomSound(KILL_PREFIX);
                if (sound) soundQueue.push(sound);
            }

            lastRoundKills = playerState.round_kills;
            if (!isPlaying) playNextSound();
        } else if (playerState.round_kills < lastRoundKills) {
            lastRoundKills = playerState.round_kills;
        }
    }

    // death detection
    if (previousState && playerState) {
        const wasAliveBefore = previousState.health > 0;
        const isDeadNow = playerState.health === 0;

        if (wasAliveBefore && isDeadNow) {
            console.log(`you died`);
            const sound = getRandomSound(DEATH_PREFIX);
            if (sound) soundQueue.push(sound);
            if (!isPlaying) playNextSound();
        }
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
