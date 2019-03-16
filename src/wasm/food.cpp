#include "coordinate.cpp"

#pragma once
class Food {
  private:
  Coordinate f;

  // Not using this because when compiling it includes
  // Emscripten includes filesystem apis which are bloated.
  // int getRandomNumber(int min, int max) {
  //   std::random_device rand_dev;
  //   std::mt19937 generator(rand_dev());
  //   std::uniform_int_distribution<int> distr(min, max);
  //   return distr(generator);
  // }

  int getRandomNumber(int max) {
            EM_ASM_({
            console.log("random");
          });
    return EM_ASM_({
      return Math.floor(Math.random() * Math.floor($0));
    }, max);
  }

  public:
  Coordinate getCoordinates() {
    return f;
  }
  
  Coordinate generateNewCoordinate(int boundX, int boundY) {
    f.x = getRandomNumber(boundX);
    f.y = getRandomNumber(boundY);
    return f;
  }
};
