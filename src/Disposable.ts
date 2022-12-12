export abstract class Disposable {
  private _disposed = false

  public get isDisposed(): boolean {
    return this._disposed
  }

  public dispose(): void {
    if (this._disposed) {
      return
    }

    this._disposed = true
    this.onDispose()
  }

  protected abstract onDispose(): void;
}

export const using: {
  <T extends Disposable, U>(disposable: T, fn: (resource: T) => U): U;

  <T extends Disposable, U>(
    disposable: new (...args: never) => T,
    fn: (resource: T) => U
  ): U;
} = <T extends Disposable, U>(
  disposable: new (...args: never) => T | T,
  callback: (disposable: T) => U
): U => {
  const service =
    typeof disposable === "function" ? new disposable() : disposable

  try {
    return callback(service)
  } finally {
    service.dispose()
  }
}
