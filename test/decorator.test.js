/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-sequences */
/* eslint-disable no-cond-assign */
/* eslint-disable max-len */
const { DIContainer, makeDecorator } = require("../")

const __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc)
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return c > 3 && r && Object.defineProperty(target, key, r), r
}

const diContainer = new DIContainer().addSingleton(Array, "Array")
const inject = makeDecorator(diContainer)

/**
 * @class
 * @type {{new (): {array: Array}}}
 */
const Test = (function () {
    function Test() { }

    __decorate([
        inject("Array")
    ], Test.prototype, "array")
    return Test
}())

test("decorator", function () {
    const t = new Test()
    expect(t.array).toBeInstanceOf(Array)
})
