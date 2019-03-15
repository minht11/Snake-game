#include <stdlib.h>
#include <vector>

#include <SDL2/SDL.h>
#include "coordinate.cpp"

class Snake {
  private:
  std::vector<Coordinate> path;
  bool needsToGrow;
  SDL_Keycode direction;

  public:
  Coordinate getLastCoordinate() {
    return path.back();
  }

  std::vector<Coordinate> getCoordinates() {
    return path;
  }

  void setStartingPosition() {
    Coordinate startingCoordinate{.x = 5, .y = 5 };
    path.clear();
    path.push_back(startingCoordinate);
    needsToGrow = false;
    direction = SDLK_RIGHT;
  }

  void setDirection(SDL_Keycode newDirection) {
     if ((path.size() > 1) && 
       ((direction == SDLK_UP && newDirection == SDLK_DOWN) ||
        (direction == SDLK_DOWN && newDirection == SDLK_UP) ||
        (direction == SDLK_LEFT && newDirection == SDLK_RIGHT) ||
        (direction == SDLK_RIGHT && newDirection == SDLK_LEFT))) {
          return;
    }
    direction = newDirection;
  }

  void move() {
    Coordinate lastCoordinate = getLastCoordinate();
    Coordinate newCoordinate;

    switch(direction) {
      case SDLK_LEFT:
        newCoordinate.x = lastCoordinate.x - 1;
        newCoordinate.y = lastCoordinate.y;
        break;
      case SDLK_RIGHT:
        newCoordinate.x = lastCoordinate.x + 1;
        newCoordinate.y = lastCoordinate.y;
        break;
      case SDLK_UP:
        newCoordinate.x = lastCoordinate.x;
        newCoordinate.y = lastCoordinate.y - 1;
        break;
      case SDLK_DOWN:
        newCoordinate.x = lastCoordinate.x;
        newCoordinate.y = lastCoordinate.y + 1;
        break;
    }
    path.push_back(newCoordinate);

    if (needsToGrow) {
      needsToGrow = false;
    } else {
      path.erase(path.begin());
    }
  }

  bool eat(Coordinate foodCoordinate) {
    Coordinate headCoordinate = getLastCoordinate();

    needsToGrow = headCoordinate == foodCoordinate;
    return needsToGrow;
  }

  bool checkIfItCollided() {
    if (path.size() == 1)
      return false;

    Coordinate lastCoordinate = getLastCoordinate();
    int i = 0;
    int size = path.size();
    for (auto & it : path) {
      if (it == lastCoordinate && size-1 != i) {
        return true;
      }
      i += 1;
    }
    return false;
  }

  bool checkIfOutOfBounds(int boundaryX, int boundaryY) {
    Coordinate lastCoordinate = getLastCoordinate();
    return lastCoordinate.x == -1 || lastCoordinate.y == -1 ||
          lastCoordinate.x == boundaryX || lastCoordinate.y == boundaryY;
  }
};