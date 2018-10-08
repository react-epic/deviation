export function isSubClass(subClass, superClass) {
  return subClass.prototype instanceof superClass
}
