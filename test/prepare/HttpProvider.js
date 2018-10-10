import React from 'react'
import { ajax } from 'rxjs/ajax'

import { Store, Inject, findSubClassOf } from '../../src'

export class HttpProvider extends Store {
  getApi(api) {
    return ajax.get(api)
  }
}

export class HttpMockupProvider extends HttpProvider {}

@Inject({
  httpProvider: findSubClassOf(HttpProvider)
})
export class AppComponent extends React.Component {
  componentDidMount() {
    this.props.httpProvider.getApi('/api')
  }

  render() {
    return <div />
  }
}
