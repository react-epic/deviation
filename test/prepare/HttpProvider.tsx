import * as React from 'react'
import { Observable } from 'rxjs'
import { AjaxResponse, ajax } from 'rxjs/ajax'

import { Inject, Store, findVariantOf } from '../../src'

export class HttpProvider extends Store {
  public getApi(api: string): void
  public getApi(api: string): Observable<AjaxResponse> {
    return ajax.get(api)
  }
}

export class HttpMockupProvider extends HttpProvider {
  public getApi(api: string): void {
    // Nothing Here!
  }
}

export interface IAppComponentProps {
  httpProvider: HttpMockupProvider
}

@Inject({
  httpProvider: findVariantOf(HttpProvider)
})
export class AppComponent extends React.Component<
  IAppComponentProps
> {
  public componentDidMount(): void {
    this.props.httpProvider.getApi('/api')
  }

  public render(): React.ReactNode {
    return <div>Hello World!</div>
  }
}
