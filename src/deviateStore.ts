import { AnyConstructorType } from './ConstructorType'
import {
  IProviderToStoreMap,
  IStoreRecord,
  InjectableRecord,
  loadInjectables
} from './Injectable'
import { Store } from './Store'

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

      super(mergeProps(stores, props))
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
