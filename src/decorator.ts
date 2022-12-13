import type { DIContainer } from "./DIContainer"

/**
 * Creates a decorator that can be used to inject a service into a class member.
 *
 * The member become a readonly property that is lazily initialized.
 */
export const makeDecorator = <TM extends { [key: string]: object }>(
    diContainer: DIContainer<TM>
) => {
    return <K extends keyof TM, T extends TM[K]>(service: K) => {
        return (target: object, propertyKey: string) => {
            let value: T|null = null
            Object.defineProperty(target, propertyKey, {
                get: () => value ??= diContainer.resolve(service),
            })
        }
    }
}
