import { Vector2, Vector3, Color, Math as MathUtils } from "three";
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

export function getRandomFloat(min,max) {
  return MathUtils.randFloat(min,max)
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

export function HSVToColor( h:number,  s:number,  v:number){
    if (h == 0 && s == 0)
        return new Color(v, v, v);

    const c = s * v;
    const x = c * (1 - Math.abs(h % 2 - 1));
    const m = v - c;

    if (h < 1) return new Color(c + m, x + m, m);
    else if (h < 2) return new Color(x + m, c + m, m);
    else if (h < 3) return new Color(m, c + m, x + m);
    else if (h < 4) return new Color(m, x + m, c + m);
    else if (h < 5) return new Color(x + m, m, c + m);
    else return new Color(c + m, m, x + m);
}
