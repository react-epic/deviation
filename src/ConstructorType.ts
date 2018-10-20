// tslint:disable-next-line interface-name
export interface AnyConstructorType<T> {
  new (...args: any[]): T
}

// tslint:disable-next-line interface-name
export interface ConstructorType<
  T extends { new (...args: any[]): any }
> {
  new (...args: ConstructorParameters<T>): T
}
