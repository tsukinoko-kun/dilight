import { Disposable } from "./Disposable";

/**
 * Dependency injection container.
 * Holds all the dependencies and provides them to the application.
 *
 * @source https://github.com/Frank-Mayer/dilight/blob/main/src/DIContainer.ts
 */
export class DIContainer<
  TypeMap extends { [key: string]: object } = {}
> extends Disposable {
  protected readonly _services: Map<string, () => object> = new Map();
  protected readonly _singletons: Map<string, object> = new Map();

  public constructor() {
    super();
  }

  public addFactory<T extends object, K extends string = string>(
    factory: () => T,
    as: K
  ): DIContainer<TypeMap & { [key in K]: T }> {
    this._services.set(as, factory);
    return this as any;
  }

  public addSingleton<T extends object, K extends string = string>(
    type: (new (...args: never) => T) | T,
    as: K
  ): DIContainer<TypeMap & { [key in K]: T }> {
    if (typeof type === "function") {
      this.addFactory(() => {
        if (!this._singletons.has(as)) {
          this._singletons.set(as, new type());
        }

        return this._singletons.get(as)!;
      }, as);
    } else {
      this._singletons.set(as, type);
      this.addFactory(() => this._singletons.get(as), as);
    }

    return this as any;
  }

  public addTransient<T extends object, K extends string = string>(
    type: new (...args: never) => T,
    as: K
  ): DIContainer<TypeMap & { [key in K]: T }> {
    this.addFactory(() => new type(), as);
    return this as any;
  }

  public resolve<K extends keyof TypeMap & string, T extends TypeMap[K]>(
    service: K
  ): T {
    const factory = this._services.get(service);
    if (factory) {
      return factory() as T;
    }

    throw new Error(`Service "${service}" not found`);
  }

  // Disposable implementation

  protected onDispose(): void {
    this._services.clear();
    this._singletons.clear();
  }
}
