export function autobind(_, _2, description) {
    const originalMethod = description.value;
    const adjDescription = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescription;
}
//# sourceMappingURL=autobind.js.map