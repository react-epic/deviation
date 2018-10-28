import { ReactWrapper, mount } from 'enzyme'
import * as React from 'react'
import { Observable } from 'rxjs'
import { AjaxResponse, ajax } from 'rxjs/ajax'

import { Deviation, Inject, Store } from '../../src'

export class CallService extends Store {
  public getPhone(): Observable<AjaxResponse> {
    return ajax.get('/phone' as string)
  }
}

export interface ICallAppProps {
  callService?: CallService
}

@Inject({
  callService: CallService
})
export class CallApp extends React.Component<ICallAppProps> {
  public triggerPhoneCall = () => {
    this.props.callService.getPhone()
  }

  public render(): React.ReactNode {
    return (
      <button onClick={this.triggerPhoneCall}>Trigger</button>
    )
  }
}

export function createMountPoint(): ReactWrapper<
  any,
  Readonly<{}>,
  React.Component<{}, {}, any>
> {
  return mount(
    <Deviation providers={[CallService]}>
      <CallApp />
    </Deviation>
  )
}
