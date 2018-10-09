import { Store } from './Store'

export class StoreInjector extends Store {
  constructor(deviation) {
    super({ providers: deviation.state.providers })
  }
}
