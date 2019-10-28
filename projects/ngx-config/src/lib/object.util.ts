// @dynamic
export class ObjectUtil {

    public static isObject(obj: any): boolean {
        return obj !== null && obj !== undefined && typeof obj === "object" && !ObjectUtil.isArray(obj);
    }

    private static isArray(variable: any): boolean {
        return variable.constructor === Array;
    }

}
