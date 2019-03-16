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
  Coordinate getHeadCoordinate() {
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
    Coordinate headCoordinate = getHeadCoordinate();
    Coordinate newHeadCoordinate;

    switch(direction) {
      case SDLK_LEFT:
        newHeadCoordinate.x = headCoordinate.x - 1;
        newHeadCoordinate.y = headCoordinate.y;
        break;
      case SDLK_RIGHT:
        newHeadCoordinate.x = headCoordinate.x + 1;
        newHeadCoordinate.y = headCoordinate.y;
        break;
      case SDLK_UP:
        newHeadCoordinate.x = headCoordinate.x;
        newHeadCoordinate.y = headCoordinate.y - 1;
        break;
      case SDLK_DOWN:
        newHeadCoordinate.x = headCoordinate.x;
        newHeadCoordinate.y = headCoordinate.y + 1;
        break;
    }
    path.push_back(newHeadCoordinate);

    if (needsToGrow) {
      needsToGrow = false;
    } else {
      path.erase(path.begin());
    }
  }

  bool eat(Coordinate foodCoordinate) {
    Coordinate headCoordinate = getHeadCoordinate();

    needsToGrow = headCoordinate == foodCoordinate;
    return needsToGrow;
  }

  bool checkIfItCollided() {
    if (path.size() == 1)
      return false;

    Coordinate headCoordinate = getHeadCoordinate();
    int i = 0;
    int size = path.size();
    for (auto & it : path) {
      if (it == headCoordinate && size-1 != i) {
        return true;
      }
      i += 1;
    }
    return false;
  }

  bool checkIfOutOfBounds(int boundaryX, int boundaryY) {
    Coordinate headCoordinate = getHeadCoordinate();
    return headCoordinate.x == -1 || headCoordinate.y == -1 ||
          headCoordinate.x == boundaryX || headCoordinate.y == boundaryY;
  }
};