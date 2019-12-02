import { Vector2, Vector3 } from "three";
import { GameObject } from "./GameObject";

export function toVector3(v: Vector2): Vector3 {
  return new Vector3(v.x, v.y, 0);
}

export function toVector2(v: Vector3): Vector2 {
  return new Vector2(v.x, v.y);
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function isColliding(a: GameObject, b: GameObject) {
  if (a.isExpired || b.isExpired) {
    return false;
  }

  const radius = a.radius + b.radius;
  const distanceToSquared = toVector2(a.position).distanceToSquared(
    toVector2(b.position)
  );
  return distanceToSquared < radius * radius;
}
