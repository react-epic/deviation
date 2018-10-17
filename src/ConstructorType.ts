export interface AnyConstructorType<T> {
  new (...args: any[]): T
}
