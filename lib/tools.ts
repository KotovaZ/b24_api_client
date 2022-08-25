export function isJsonString(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function object2Url<T>(obj: T): string {
    let parts: string[] = [];

    function process(o: T, parentKey: string = '') {
        for (const [key, value] of Object.entries(o)) {
            const newKey = parentKey ? `${parentKey}[${key}]` : key;
            if (typeof value === 'object') {
                process(value, newKey);
            } else {
                parts.push(`${newKey}=${value}`);
            }
        }
    }

    process(obj);
    return parts.join('&');
}