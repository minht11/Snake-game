#include <stdio.h>
#include <emscripten/emscripten.h>

#include "game.cpp"
#include "input/input.cpp"

Game game;
Input input;

double TIME_PER_TICK = 160.0;
double lastTickTime;
double lastFrameTime;

void main_tick() {
  if (!game.isInitialized) {
    game.initialize();
    emscripten_pause_main_loop();
  }
  if (!game.playing) {
    emscripten_pause_main_loop();
    return;
  }
  SDL_Event event;
  while (SDL_PollEvent(&event)) {
    input.setEvent(event);
  }

  while (emscripten_get_now() > lastTickTime + TIME_PER_TICK) {
    game.changeDirection(input.getDirection());
    game.logic();
    lastTickTime += TIME_PER_TICK;
  }
  lastFrameTime = emscripten_get_now();
  game.draw();
}

extern "C" {

  EMSCRIPTEN_KEEPALIVE
  void resizeGame(double w, double h) {
    game.resize(w, h);
  }

  EMSCRIPTEN_KEEPALIVE
  void setGameMode(int type = 1) {
    switch(type) {
      case 0:
        TIME_PER_TICK = 220.0;
        break;
      case 1:
        TIME_PER_TICK = 128.0;
        break;
      case 2:
        TIME_PER_TICK = 80.0;
        break;
    }
  }

  EMSCRIPTEN_KEEPALIVE
  void pauseGame() {
    emscripten_pause_main_loop();
  }

  EMSCRIPTEN_KEEPALIVE
  void resumeGame() {
    lastTickTime = emscripten_get_now();
    lastFrameTime = emscripten_get_now();
    emscripten_resume_main_loop();
  }

  EMSCRIPTEN_KEEPALIVE
  void playGame() {
    lastTickTime = emscripten_get_now();
    lastFrameTime = emscripten_get_now();
    game.setScene();
    game.playing = true;
    emscripten_resume_main_loop();
  }

}

int main() {
  emscripten_set_main_loop(main_tick, 0, 1);
  game.clearRenderer();
  return 0;
}