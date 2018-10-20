import * as React from 'react'

import { deviateComponent } from './deviateComponent'
import { deviateStore } from './deviateStore'
import { isVariantOf } from './isVariantOf'

import { Store } from './Store'

export function defaultMergeProps(injectableProviders, props) {
  return {...injectableProviders, ...props}
}

export function Inject(injectables, mergeProps) {
  mergeProps = mergeProps || defaultMergeProps

  return function deviate(WrappedConstructor) {
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
