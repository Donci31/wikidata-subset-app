// debounce.ts
function debounce<T extends (...args: never[]) => void>(func: T, delay: number): T {
    let timeout: NodeJS.Timeout;
    return function (this: never, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    } as T;
}

export default debounce;
