import * as Enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import { JSDOM } from 'jsdom'

declare var global: any

function configureWindow(): void {
  const window = new JSDOM('').window

  global.window = window
  global.document = window.document
}

function configureEnzyme(): void {
  Enzyme.configure({ adapter: new Adapter() })
}

function runConfigs(configs: Function[]): void {
  for (const config of configs) {
    config()
  }
}

runConfigs([configureWindow, configureEnzyme])
