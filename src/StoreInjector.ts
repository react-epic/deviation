import { IProviderToStoreMap } from './Injectable'
import { PureDeviation } from './PureDeviation'
import { Store } from './Store'

interface IStoreInjectorProps {
  providers: IProviderToStoreMap
}

export class StoreInjector<S> extends Store<
  IStoreInjectorProps,
  S
> {
  constructor(deviation: PureDeviation) {
    super({ providers: deviation.state.providers })
  }
}
