#include <cmath>
#include <SDL2/SDL.h>

class Touch {
  private:
  double xDown = 0;                                                        
  double yDown = 0;
  bool isMoving = false;
  SDL_Keycode direction = SDLK_RIGHT;

  protected:
  void touchStart(SDL_TouchFingerEvent tfinger) {
    isMoving = false;
    xDown = tfinger.x;
    yDown = tfinger.y;
  }

  SDL_Keycode touchMove(SDL_TouchFingerEvent tfinger) {
    if (isMoving) {
        return -1;
    }

    double xUp = tfinger.x;                                    
    double yUp = tfinger.y;

    double xDiff = xDown - xUp;
    double yDiff = yDown - yUp;

    if (std::fabs(xDiff) > std::fabs(yDiff)) {
      if (xDiff > 0) {
        direction = SDLK_LEFT;
      } else {
        direction = SDLK_RIGHT;
      }                       
    } else {
      if ( yDiff > 0 ) {
        direction = SDLK_UP;
      } else { 
        direction = SDLK_DOWN;
      }                                                                 
    }
    xDown = 0;
    yDown = 0;
    isMoving = true;
    return direction;
  }
};
