# CS2 KillFeed Sound Notifier

A very small Node.js app that plays custom sounds when you get a kill or die in **Counter-Strike 2**, using Game State Integration (GSI).

![CS2 KillFeed](https://img.shields.io/badge/CS2-Kill%2FDeath%20Sound%20Notifier-blue?style=flat-square)

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

1. Move the `gamestate_integration_killfeed.cfg` file into your installition folder:
```
Counter-Strike Global Offensive\game\csgo\cfg
```

3. Save the file and restart CS2.