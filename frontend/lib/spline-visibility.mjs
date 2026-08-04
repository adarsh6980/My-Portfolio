const ROBOT_VISIBLE_MATERIALS = [
  ["Head 2", "#555861"],
  ["Hand", "#777b84"],
];

/**
 * Lightens the nearly-black face and shared hand mesh after Spline loads.
 *
 * @param {{ findObjectByName(name: string): { color: string } | null | undefined }} spline
 * @returns {number} number of scene objects updated
 */
export function improveRobotVisibility(spline) {
  let updatedObjectCount = 0;

  for (const [objectName, color] of ROBOT_VISIBLE_MATERIALS) {
    const object = spline.findObjectByName(objectName);
    if (!object) continue;

    object.color = color;
    updatedObjectCount += 1;
  }

  return updatedObjectCount;
}
