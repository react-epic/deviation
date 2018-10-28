import { forEach } from 'lodash'

import { AnyConstructorType } from './ConstructorType'
import {
  IProviderToStoreMap,
  IStoreRecord,
  InjectableRecord,
  loadInjectables
} from './Injectable'
import { Store, notifier } from './Store'

export interface IStoreWrapperProps {
  providers?: IProviderToStoreMap
  injectables?: InjectableRecord
}

export function deviateStore(
  WrappedStore: AnyConstructorType<Store<any, any>>,
  injectables: InjectableRecord,
  mergeProps: (
    stores: IStoreRecord,
    props: IStoreWrapperProps
  ) => IStoreWrapperProps
): AnyConstructorType<Store<any, any>> {
  class StoreWrapper extends WrappedStore {
    constructor(props: IStoreWrapperProps) {
      const { providers } = props

      const stores = loadInjectables(injectables, providers)

      forEach(stores, store => {
        const subscription = store[notifier].subscribe(() => {
          if (this.storeDidUpdate) {
            const prevProps = this.props
            this.props = { ...prevProps }

            this.storeDidUpdate(prevProps, this.state)
          }
        })

        this[notifier].subscribe(null, null, () =>
          subscription.unsubscribe()
        )
      })

      super(mergeProps(stores, props))

      this[notifier].subscribe(prevState =>
        this.storeDidUpdate(this.props, prevState)
      )
    }

    public static updateProviders(
      store: Store<any, any>,
      providers: IProviderToStoreMap
    ): void {
      store.props = {
        ...store.props,
        ...mergeProps(loadInjectables(injectables, providers), {
          providers
        })
      }
    }
  }

  return StoreWrapper
}
