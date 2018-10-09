export function enter(func) {
  return function(event) {
    if (event.code === 'Enter') {
      func(event)
    }
  }
}
