#include <SDL2/SDL.h>
#include "keyboard.cpp"
#include "touch.cpp"

class Input : protected Keyboard, protected Touch {
  private:
  SDL_Keycode direction = SDLK_RIGHT;

  public:
  void setEvent(SDL_Event event) {
    SDL_Keycode tempDirection = -1;
    if (event.type == SDL_KEYDOWN) {
      tempDirection = findKeyDirection(event.key.keysym.sym);
    }
    if (event.type == SDL_FINGERDOWN) {
      touchStart(event.tfinger);
    }
    if (event.type == SDL_FINGERMOTION) {
      tempDirection = touchMove(event.tfinger);
    }
    if (tempDirection != -1) {
      direction = tempDirection;
    }
  }

  SDL_Keycode getDirection() {
    return direction;
  }

  void reset() {
    direction = SDLK_RIGHT;
  }
};