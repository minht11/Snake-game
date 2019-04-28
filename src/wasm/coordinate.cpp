#pragma once
struct Coordinate {
  int x;
  int y;
  bool operator==(const Coordinate right) const {
    return this->x == right.x && this->y == right.y;
  }
};
