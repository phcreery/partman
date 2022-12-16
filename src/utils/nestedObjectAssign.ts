/**
 * @description object assign with nested propertied without throwing out previous properties
 * https://stackoverflow.com/questions/41588068/object-assign-override-nested-property
 * @param {Object} target
 * @param {Object} sources list of sources to deep assign to target object
 * @return {Object}
 */
export function nestedObjectAssign(target: any, ...sources: any[]) {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      const s_val = source[key];
      const t_val = target[key];
      target[key] =
        t_val && s_val && typeof t_val === "object" && typeof s_val === "object" ? nestedObjectAssign(t_val, s_val) : s_val;
    });
  });
  return target;
}
