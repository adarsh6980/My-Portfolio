import assert from "node:assert/strict";
import test from "node:test";

import { improveRobotVisibility } from "./spline-visibility.mjs";

function minimumRgbChannel(hexColor) {
  return Math.min(
    Number.parseInt(hexColor.slice(1, 3), 16),
    Number.parseInt(hexColor.slice(3, 5), 16),
    Number.parseInt(hexColor.slice(5, 7), 16),
  );
}

test("makes the robot face and hands visibly lighter than black", () => {
  const face = { color: "#000000" };
  const hands = { color: "#030303" };
  const sceneObjects = new Map([
    ["Head 2", face],
    ["Hand", hands],
  ]);

  const updatedObjectCount = improveRobotVisibility({
    findObjectByName(name) {
      return sceneObjects.get(name);
    },
  });

  assert.equal(updatedObjectCount, 2);
  assert.ok(minimumRgbChannel(face.color) >= 64, `face remained too dark: ${face.color}`);
  assert.ok(minimumRgbChannel(hands.color) >= 64, `hands remained too dark: ${hands.color}`);
});
