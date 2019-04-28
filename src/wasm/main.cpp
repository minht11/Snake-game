#include <emscripten.h>
#include "game.cpp"

Game game;
int gameSpeedMultiplier = 8;

void mainTick() {
  if (!game.isInitialized) {
    emscripten_pause_main_loop();
    game.initialize();
    return;
  }
  if (game.playing) {
    game.tick();
  }
}

int main() {
  emscripten_set_main_loop(&mainTick, 0, 1);
  return 0;
}

extern "C" {
  extern void pauseDirectionListener();
  extern void resumeDirectionListener();

  EMSCRIPTEN_KEEPALIVE
  void resizeGame(float w, float h) {
    game.resize(w, h);
  }

  EMSCRIPTEN_KEEPALIVE
  void setGameSpeed(int type = 1) {
    switch(type) {
      case 0:
        gameSpeedMultiplier = 16;
        break;
      case 1:
        gameSpeedMultiplier = 8;
        break;
      case 2:
        gameSpeedMultiplier = 4;
        break;
    }
  }

  EMSCRIPTEN_KEEPALIVE
  void pauseGame() {
    pauseDirectionListener();
    emscripten_pause_main_loop();
  }

  EMSCRIPTEN_KEEPALIVE
  void resumeGame() {
    emscripten_set_main_loop_timing(EM_TIMING_SETTIMEOUT, 16 * gameSpeedMultiplier);
    emscripten_resume_main_loop();
    resumeDirectionListener();
  }

  EMSCRIPTEN_KEEPALIVE
  void playGame() {
    game.playing = true;
    game.setScene();
    resumeGame();
  }
}
