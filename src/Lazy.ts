const NOT_INITIALIZED: unique symbol = Symbol('NOT_INITIALIZED');

export const lazy = <K>(cb: () => K): () => K => {
    let f = () => {
        const v = cb();
        f = () => v;
        return v;
    };
    return () => f();
};
