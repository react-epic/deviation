import { Deviation } from './Deviation'
import { StoreMap } from './Injectable'
import { Store } from './Store'

interface IStoreInjectorProps {
  providers: StoreMap
}

export class StoreInjector<S> extends Store<
  IStoreInjectorProps,
  S
> {
  constructor(deviation: Deviation) {
    super({ providers: deviation.state.providers })
  }
}
