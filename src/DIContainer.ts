import { Disposable } from "./Disposable"

/**
 * Dependency injection container.
 * Holds all the dependencies and provides them to the application.
 *
 * @source https://github.com/Frank-Mayer/dilight/blob/main/src/DIContainer.ts
 */
export class DIContainer<
    // eslint-disable-next-line @typescript-eslint/ban-types
    TypeMap extends { [key: string]: object } = {}
> extends Disposable {
    protected readonly _services: Map<string, () => object> = new Map()
    protected readonly _singletons: Map<string, object> = new Map()

    public constructor() {
        super()
    }

    public addFactory<T extends object, K extends string = string>(
        factory: () => T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        this._services.set(as, factory)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this as any
    }

    public addSingleton<T extends object, K extends string = string>(
        type: (new (...args: never) => T) | T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        if (typeof type === "function") {
            return this.addFactory(() => {
                if (!this._singletons.has(as)) {
                    this._singletons.set(as, new type())
                }

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this._singletons.get(as)!
            }, as)
        }

        this._singletons.set(as, type)
        return this.addFactory(() => this._singletons.get(as), as)
    }

    public addTransient<T extends object, K extends string = string>(
        type: new (...args: never) => T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        return this.addFactory(() => new type(), as)
    }

    public resolve<K extends keyof TypeMap & string, T extends TypeMap[K]>(
        service: K
    ): T;
    public resolve<T extends TypeMap[keyof TypeMap]>(service: keyof TypeMap): T;
    public resolve<K extends keyof TypeMap & string, T extends TypeMap[K]>(
        service: K
    ): T {
        const getter = this._services.get(service)
        if (getter) {
            return getter() as T
        }

        throw new Error(`Service "${service}" not found`)
    }

    /**
     * Provides a way to get a service from this container
     * without having to use the `DIContainer` object.
     *
     * This is useful for passing the injector to other objects
     * or exporting it from a module.
     *
     * The typemap is copied from the container itself.
     *
     * @example
     * const dic = new DIContainer()
     *  .addTransient<Logger>(ConsoleLogger, "Logger")
     *
     * export const inject = dic.getInjector()
     *
     * // somewhere else
     * @inject("Logger")
     * const logger = injector("Logger")
     */
    public getInjector() {
        return <K extends keyof TypeMap & string, T extends TypeMap[K]>(
            service: K
        ): T => this.resolve(service)
    }

    // Disposable implementation

    protected onDispose(): void {
        this._services.clear()
        this._singletons.clear()
    }
}
