#include <vector>
#include "coordinate.cpp"

class Snake {
  private:
  std::vector<Coordinate> path;
  bool needsToGrow;
  int direction = 3;

  public:
  const Coordinate getHeadCoordinate() {
    return path.back();
  }

  const std::vector<Coordinate>& getCoordinates() {
    return path;
  }

  void setStartingPosition(int x, int y) {
    path.clear();
    path.push_back(Coordinate {.x = x - 1, .y = y });
    path.push_back(Coordinate {.x = x, .y = y });
    needsToGrow = false;
  }

  void setDirection(int newDirection) {
     if (newDirection > -1 && newDirection < 4 && 
       ((direction == 0 && newDirection == 2) ||
        (direction == 2 && newDirection == 0) ||
        (direction == 1 && newDirection == 3) ||
        (direction == 3 && newDirection == 1))) {
          return;
    }
    direction = newDirection;
  }

  void move() {
    Coordinate headCoordinate = getHeadCoordinate();
    Coordinate newHeadCoordinate;

    switch(direction) {
      case 1: // Left
        newHeadCoordinate.x = headCoordinate.x - 1;
        newHeadCoordinate.y = headCoordinate.y;
        break;
      case 3: // Right
        newHeadCoordinate.x = headCoordinate.x + 1;
        newHeadCoordinate.y = headCoordinate.y;
        break;
      case 0: // Top
        newHeadCoordinate.x = headCoordinate.x;
        newHeadCoordinate.y = headCoordinate.y - 1;
        break;
      case 2: // Bottom
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

  bool didCollideWithItself() {
    Coordinate headCoordinate = getHeadCoordinate();
    int i = 0;
    int size = path.size();
    
    for (auto & it : path) {
      if (it == headCoordinate && size - 1 != i) {
        return true;
      }
      i += 1;
    }
    return false;
  }

  bool isOutOfBounds(int boundaryX, int boundaryY) {
    Coordinate headCoordinate = getHeadCoordinate();
    return headCoordinate.x < 0 || headCoordinate.y < 0 ||
      headCoordinate.x >= boundaryX || headCoordinate.y >= boundaryY;
  }
};