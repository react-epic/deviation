import { isFunction } from 'lodash'
import * as React from 'react'

export function enter(event: React.KeyboardEvent<{}>): boolean
export function enter(
  func: (event: React.KeyboardEvent<{}>) => void
): ((event: React.KeyboardEvent<{}>) => void)

export function enter(
  func:
    | React.KeyboardEvent<{}>
    | ((event: React.KeyboardEvent<{}>) => void)
): boolean | ((event: React.KeyboardEvent<{}>) => void) {
  if (!isFunction(func)) {
    return func.keyCode === 13
  }

  return (event: React.KeyboardEvent<{}>): void => {
    if (enter(event)) {
      func(event)
    }
  }
}
