#include <random>
#include "coordinate.cpp"

#pragma once
class Food {
  private:
  Coordinate f;

  int getRandomNumber(int min, int max) {
    std::random_device rand_dev;
    std::mt19937 generator(rand_dev());
    std::uniform_int_distribution<int> distr(min, max);
    return distr(generator);
  }

  public:
  Coordinate getCoordinates() {
    return f;
  }
  
  Coordinate generateNewCoordinate(int boundX, int boundY) {
    f.x = getRandomNumber(0, boundX);
    f.y = getRandomNumber(0, boundY);
    return f;
  }
};
