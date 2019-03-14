#pragma once
struct Coordinate {
  int x;
  int y;
  bool operator==(const Coordinate &co) const {
    return (this->x == co.x && this->y == co.y) ? true : false;
  }
};