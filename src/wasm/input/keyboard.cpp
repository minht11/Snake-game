#include <SDL2/SDL.h>

class Keyboard {
  private:
  SDL_Keycode direction = SDLK_RIGHT;

  protected:
  SDL_Keycode findKeyDirection(SDL_Keycode keycode) {
    switch (keycode) {
      case SDLK_w:
      case SDLK_UP:
        direction = SDLK_UP;
        return direction;
      case SDLK_s:
      case SDLK_DOWN:
        direction = SDLK_DOWN;
        return direction;
      case SDLK_a:
      case SDLK_LEFT:
        direction = SDLK_LEFT;
        return direction;
      case SDLK_d:
      case SDLK_RIGHT:
        direction = SDLK_RIGHT;
        return direction;
      default:
        return -1;
    }
  }
};
