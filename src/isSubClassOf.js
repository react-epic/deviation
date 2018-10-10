export function isSubClassOf(subClass, superClass) {
  return subClass.prototype instanceof superClass
}
