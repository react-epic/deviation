import * as React from 'react'

import { deviateComponent } from './deviateComponent'
import { deviateStore } from './deviateStore'
import { isVariantOf } from './isVariantOf'

import { AnyConstructorType } from './ConstructorType'
import { IStoreRecord, InjectableRecord } from './Injectable'
import { Store } from './Store'

export function defaultMergeProps(
  stores: IStoreRecord,
  props: any
): any {
  return { ...stores, ...props }
}

export type InjectedComponentType = AnyConstructorType<
  React.Component<any, any> | Store<any, any>
>

export function Inject(
  injectables: InjectableRecord,
  mergeProps: (
    stores: IStoreRecord,
    props: any
  ) => any = defaultMergeProps
): (<T extends InjectedComponentType>(
  WrappedConstructor: T
) => T) {
  return WrappedConstructor => {
    return isVariantOf(WrappedConstructor, React.Component)
      ? deviateComponent(
          WrappedConstructor,
          injectables,
          mergeProps
        )
      : isVariantOf(WrappedConstructor, Store)
        ? deviateStore(
            WrappedConstructor,
            injectables,
            mergeProps
          )
        : WrappedConstructor
  }
}
