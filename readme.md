# CS2 killfeed sound notifier

A small Node.js app that plays custom sounds when you get a kill or die in Counter Strike 2, using game state integration.

## Features

- Plays a sound when you get a kill
- Plays a different sound when you die
- Uses `ffplay` to play `.mp3` sound files
- Tracks round kills and death status live

---

## Requirements

- Node.js
- [FFmpeg](https://ffmpeg.org) installed and `ffplay` available in system path
- Counter Strike 2 with game state integration configured

---

## Installation

1. Clone the repository
    ```
    git clone https://github.com/Zyphrenn/CS2-Killfeed.git
    cd CS2-Killfeed
    ```

2. Install dependencies
    ```
    npm install
    ```

3. Add your `.mp3` files in `sounds/`
- `kill_.mp3` for kills
- `death_.mp3` for deaths

---

## Game state integration setup
- Find CS2 in Steam
- Right click Counter Strike 2 -> choose "Manage" -> "Browse local files"
- Go to `game/csgo/cfg/`
- Copy the `gamestate_integration_killfeed.cfg` file into this directory
- Save and restart CS

---

## Running the script
- Start Counter Strike normally, then start the script by running `node main.js`