import { ObjectUtil } from "./object.util";


describe("ObjectUtil", () => {

    it("should reject strings", () => {

        const resultNonEmpty = ObjectUtil.isObject("string");
        expect(resultNonEmpty).toEqual(false);

        const resultEmpty = ObjectUtil.isObject("");
        expect(resultEmpty).toEqual(false);

    });

    it("should reject numbers", () => {

        const integer = ObjectUtil.isObject(123);
        expect(integer).toEqual(false);

        const decimal = ObjectUtil.isObject(123.123);
        expect(decimal).toEqual(false);

    });

    it("should reject booleans", () => {

        const resultTrue = ObjectUtil.isObject(true);
        expect(resultTrue).toEqual(false);

        const resultFalse = ObjectUtil.isObject(false);
        expect(resultFalse).toEqual(false);

    });

    it("should reject undetermined values", () => {

        const resultNull = ObjectUtil.isObject(null);
        expect(resultNull).toEqual(false);

        const resultUndef = ObjectUtil.isObject(undefined);
        expect(resultUndef).toEqual(false);

        const resultNan = ObjectUtil.isObject(NaN);
        expect(resultNan).toEqual(false);

    });

    it("should reject arrays", () => {

        const resultNonEmpty = ObjectUtil.isObject([1, 2]);
        expect(resultNonEmpty).toEqual(false);

        const resultEmpty = ObjectUtil.isObject([]);
        expect(resultEmpty).toEqual(false);

        const resultArrayObj = ObjectUtil.isObject([{key: "val"}, {key: "val"}]);
        expect(resultArrayObj).toEqual(false);

    });

    it("should accept objects", () => {

        const resultEmpty = ObjectUtil.isObject({});
        expect(resultEmpty).toEqual(true);

        const resultNonEmpty = ObjectUtil.isObject({key: "val"});
        expect(resultNonEmpty).toEqual(true);

    });
});
