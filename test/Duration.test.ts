import * as assert from "assert";
import {Duration} from "../src/Duration";

describe('Duration', () => {

    describe('static shortDuration', () => {
        it('returns an instance of Duration (with parameter order revered)', () => {
            assert.ok(Duration.shortDuration(3) instanceof Duration);
            const diff =
                Duration.shortDuration(3, 2, 4).getExpiration().getTime()
                - new Duration(0, 0, 4, 4, 3).getExpiration().getTime();
            assert.ok(diff < 1000);
        });
    });
});
