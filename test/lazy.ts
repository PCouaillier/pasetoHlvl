import { expect } from "chai";
import { lazy } from "../src/Lazy";

describe('lazy', () => {
    it('returns the same element after first call', () => {
        const l = lazy(Math.random);
        const l1 = lazy(Math.random);
        const l2 = lazy(Math.random);

        for (const t of [l, l1, l2]) {
            expect(t())
                .to.deep.equal(t())
                .and.to.deep.equal(t());
        }

        expect(l())
            .to.not.deep.equal(l1())
            .and.not.to.deep.equal(l2());

    });
});
