import React from 'react'
import { mount } from 'enzyme'
import { ajax } from 'rxjs/ajax'

import { Inject, Deviation, Store } from '../../src'

export class CallService extends Store {
  makeAPhoneCall() {
    return ajax.get('/phone')
  }
}

@Inject({
  callService: CallService
})
export class CallApp extends React.Component {
  triggerPhoneCall = () => {
    this.props.callService.makeAPhoneCall()
  }

  render() {
    return (
      <button onClick={this.triggerPhoneCall}>Trigger</button>
    )
  }
}

export function createMountPoint() {
  return mount(
    <Deviation providers={[CallService]}>
      <CallApp />
    </Deviation>
  )
}