import { Deviation } from './Deviation'
import { IProviderToStoreMap } from './Injectable'
import { Store } from './Store'

interface IStoreInjectorProps {
  providers: IProviderToStoreMap
}

export class StoreInjector<S> extends Store<
  IStoreInjectorProps,
  S
> {
  constructor(deviation: Deviation) {
    super({ providers: deviation.state.providers })
  }
}
