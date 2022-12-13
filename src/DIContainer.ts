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
    protected readonly _services: Map<keyof TypeMap, () => object> = new Map()
    protected readonly _singletons: Map<keyof TypeMap, object> = new Map()

    public constructor() {
        super()
    }

    public addFactory<T extends object, K extends string = string>(
        factory: () => T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        this._services.set(as, factory)
        return this as DIContainer<TypeMap & { [key in K]: T }>
    }

    public addSingleton<
        T extends object,
        K extends string = string
    >(
        type: (new (...args: never) => T) | T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        if (typeof type === "function") {
            this.addFactory(() => {
                if (!this._singletons.has(as)) {
                    this._singletons.set(as, new type())
                }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return this._singletons.get(as)!
            }, as)

            return this as DIContainer<TypeMap & { [key in K]: T }>
        }

        this._singletons.set(as, type)
        this.addFactory(() => this._singletons.get(as), as)
        return this as DIContainer<TypeMap & { [key in K]: T }>
    }

    public addTransient<T extends object, K extends string = string>(
        type: new (...args: never) => T,
        as: K
    ): DIContainer<TypeMap & { [key in K]: T }> {
        this.addFactory(() => new type(), as)
        return this as DIContainer<TypeMap & { [key in K]: T }>
    }

    public resolve<K extends keyof TypeMap, T extends TypeMap[K]>(
        service: K
    ): T {
        const getter = this._services.get(service)
        if (getter) {
            return getter() as T
        }

        throw new Error(`Service "${service as string}" not found`)
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
