
# Snake game PWA.
![alt text](https://raw.githubusercontent.com/minht11/Snake-game/master/image.png)
## Features
- Completely responsive.
- Supports both touch and keyboard input.
- Works offline. 
- It is a game.

## Run locally
- Setup Emscripten https://emscripten.org/docs/getting_started/downloads.html
- `npm install`
- Run `./wasm-compile.sh` with optional arguments:
	- `dev=true` compiles unoptimized build used for testing.
	-	`asm=true` outputs `asm.js` build for browsers which do not support Web Assembly natively.
- `npm run rollup:build` or `npm run rollup:watch`
- Start game using your chosen local server