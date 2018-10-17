import { Store } from './Store'

import { Deviation } from './Deviation'

interface StoreInjectorProps {
  providers: Map<typeof Store, Store<any, any>>
}

export class StoreInjector<S> extends Store<
  StoreInjectorProps,
  S
> {
  constructor(deviation: Deviation) {
    super({ providers: deviation.state.providers })
  }
}
