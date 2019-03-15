#pragma once
struct Coordinate {
  int x;
  int y;
  bool operator==(const Coordinate co) const {
    return (this->x == co.x && this->y == co.y) ? true : false;
  }
  // bool operator==(const int &co) const {
  //   return (this->x == co && this->y == co) ? true : false;
  // }
};