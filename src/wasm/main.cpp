#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <cmath>

#include <emscripten/emscripten.h>
#include <emscripten/html5.h>
#include <SDL2/SDL.h>

#include "game.cpp"

static int quit = 0;

Game game;

double TIME_PER_TICK = 160.0;
double lastTickTime;
double lastFrameTime;

void setGameDirection() {
  SDL_Event event;
  while (SDL_PollEvent(&event)) {
    switch (event.type) {
      case SDL_QUIT:
        quit = 1;
        break;
    
      case SDL_KEYDOWN:
        switch (event.key.keysym.sym) {
          case SDLK_w:
          case SDLK_UP:
            game.changeDirection(SDLK_UP);
            break;
          case SDLK_s:
          case SDLK_DOWN:
            game.changeDirection(SDLK_DOWN);
            break;
          case SDLK_a:
          case SDLK_LEFT:
            game.changeDirection(SDLK_LEFT);
            break;
          case SDLK_d:
          case SDLK_RIGHT:
            game.changeDirection(SDLK_RIGHT);
            break;
        }
        return;

      case SDL_FINGERMOTION:
        auto dx = event.tfinger.dx;
        auto dy = event.tfinger.dy;
        if (std::fabs(dx) > std::fabs(dy)) {
          game.changeDirection(dx > 0.00 ? SDLK_RIGHT : SDLK_LEFT);
        } else {
          game.changeDirection(dy > 0.00 ? SDLK_DOWN : SDLK_UP);
        }
        // EM_ASM_({
        //   console.log($0, $1);
        // }, event.tfinger.dx, event.tfinger.dy);
          // EM_ASM_({
          //   console.log("touch");
          // });
        break;
    }
  }
}

void main_tick() {
  if (!game.playing) {
    emscripten_pause_main_loop();
    return;
  }

  while (emscripten_get_now() > lastTickTime + TIME_PER_TICK) {
    setGameDirection();
    game.logic();
    if (game.isGameOver) {
      game.playing = false;
    }
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
    EM_ASM({
      console.log("1");
    });
  }

}

int main() {
  game.initializeRender();

  emscripten_set_main_loop(main_tick, -1, 1);

  game.clearRenderer();
  return 0;
}