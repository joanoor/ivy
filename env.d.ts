declare type Recordable<T = any> = Record<string, T>
declare type AnyFunction = (...args: any[]) => any
declare type ConstructorFunction = new (...args: any[]) => any
declare type Values<T> = T[keyof T]
declare type PropValue<T, U extends keyof T> = NonNullable<T[U]>
declare type Nullable<T> = T | null;

type ExitFullscreen = typeof document.exitFullscreen
type RequestFullscreen = typeof document.documentElement.requestFullscreen

interface Document {
  webkitExitFullscreen: ExitFullscreen
  mozCancelFullScreen: ExitFullscreen
  msExitFullscreen: ExitFullscreen
}

interface HTMLElement {
  webkitRequestFullscreen: RequestFullscreen
  mozRequestFullScreen: RequestFullscreen
  msRequestFullscreen: RequestFullscreen
}
