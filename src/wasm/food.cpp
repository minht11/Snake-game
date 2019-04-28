#include <emscripten.h>
#include "coordinate.cpp"

#pragma once
class Food {
  private:
  Coordinate position;

  int getRandomNumber(int max) {
    return EM_ASM_({
      return Math.floor(Math.random() * Math.floor($0));
    }, max);
  }

  public:
  Coordinate getCoordinates() {
    return position;
  }
  
  Coordinate generateNewCoordinate(int boundX, int boundY) {
    position.x = getRandomNumber(boundX);
    position.y = getRandomNumber(boundY);
    return position;
  }
};
