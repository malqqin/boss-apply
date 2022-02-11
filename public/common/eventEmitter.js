export default class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(eventName, callback) {
        const callbacks = this._events[eventName] || [];
        callbacks.push(callback);
        this._events[eventName] = callbacks;
        return this;
    }

    emit(eventName, ...args) {
        console.log(eventName);
        const callbacks = this._events[eventName] || [];
        callbacks.forEach(cb => cb(...args));
        return this;
    }

    once(eventName, callback) {
        const one = (...args) => {
            callback(...args);
            this.off(eventName, one);
        }
        one.initialCallback = callback;
        this.on(eventName, one);
        return this;
    }

    off(eventName, callback) {
        const callbacks = this._events[eventName] || [];
        const newCallbacks = callbacks.filter(fn => fn != callback && fn.initialCallback != callback);
        this._events[eventName] = newCallbacks;
        return this;
    }
}