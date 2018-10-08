export function extractProviders(providers, injectables) {
  return Object.keys(injectables)
    .map(key => ({
      [key]: providers.get(injectables[key])
    }))
    .reduce((props, next) => Object.assign(props, next), {})
}
