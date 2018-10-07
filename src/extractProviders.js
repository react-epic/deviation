export function extractProviders(providers, injectables) {
  return Object.keys(injectables)
    .map(key => ({
      [key]: providers.find(
        provider => provider.constructor === injectables[key]
      )
    }))
    .reduce((props, next) => Object.assign(props, next), {})
}
