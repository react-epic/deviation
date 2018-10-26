import { ReactWrapper, mount } from 'enzyme'
import * as React from 'react'

import { Deviation, Inject, Store } from '../../src'

export interface IATalkProps {
  bTalk: BTalk
}

export interface IATalkState {
  received: boolean
}

@Inject({
  bTalk: () => BTalk
})
export class ATalk extends Store<IATalkProps, IATalkState> {
  public state: IATalkState = {
    received: false
  }

  public storeDidMount(): void {
    this.send()
  }

  public receive(): void {
    this.setState({ received: true })
  }

  public send(): void {
    this.props.bTalk.receive()
  }
}

export interface IBTalkProps {
  aTalk: ATalk
}

export interface IBTalkState {
  received: boolean
}

@Inject({
  aTalk: () => ATalk
})
export class BTalk extends Store<IBTalkProps, IBTalkState> {
  public state: IBTalkState = {
    received: false
  }

  public storeDidMount(): void {
    this.send()
  }

  public receive(): void {
    this.setState({ received: true })
  }

  public send(): void {
    this.props.aTalk.receive()
  }
}

export interface ICommunicateAppProps {
  aTalk?: ATalk
  bTalk?: BTalk
}

@Inject({
  aTalk: ATalk,
  bTalk: BTalk
})
export class CommunicateApp extends React.Component<
  ICommunicateAppProps
> {
  public render(): React.ReactNode {
    const { aTalk, bTalk } = this.props

    return (
      <div>
        <p id="a">{JSON.stringify(aTalk.state.received)}</p>
        <p id="b">{JSON.stringify(bTalk.state.received)}</p>
      </div>
    )
  }
}

export function createMountPoint(): ReactWrapper<
  any,
  Readonly<{}>,
  React.Component<{}, {}, any>
> {
  return mount(
    <Deviation providers={[ATalk, BTalk]}>
      <CommunicateApp />
    </Deviation>
  )
}
