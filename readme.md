# CS2 KillFeed Sound Notifier

A very small Node.js app that plays custom sounds when you get a kill or die in **Counter-Strike 2**, using Game State Integration (GSI).

![CS2 KillFeed](https://img.shields.io/badge/CS2-Kill/Death_Sound_Notifier-blue)

## Features

- Plays a sound when you get a kill  
- Plays a different sound when you die  
- Uses `ffplay` to play `.mp3` sound files  
- Tracks round kills and death status in real time  

---

## Requirements

- Node.js (v18+ recommended)  
- [FFmpeg](https://ffmpeg.org) installed and `ffplay` available in your system PATH  
- Counter-Strike 2 with **Game State Integration (GSI) configured**  

---

## Installation

1. **Clone the repository:**  
   ```
   git clone https://github.com/Zyphrenn/CS2-Killfeed.git
   cd CS2-Killfeed
   ```

2. **Install dependencies:**  
   ```
   npm install
   ```

3. **Add your sounds:**  
   Place your `.mp3` files in the `sounds/` folder:  
   - `kill.mp3` for kills  
   - `death.mp3` for deaths  

---

## Game State Integration Setup (CS2)
- Open CS2's installation folder:
- Navigate to CS2 in Steam
- Right click Counter-Strike 2 - choose "Manage" - "Browse local files".
- Navigate to `game/csgo/cfg/`
- Move the `gamestate_integration_killfeed.cfg` file into this directory
- Save the file and restart CS2.

---

## Disclaimer

This project uses CS2's official Game State Integration system and **does not modify the game, inject code, or interact with VAC-protected memory in any way.**

However, external programs (like audio players or scripts) may unintentionally trigger VAC-related warnings if misconfigured.

**By using this program, you acknowledge that you do so at your own risk. I am not responsible for any bans, timeouts, or account issues that may arise.**