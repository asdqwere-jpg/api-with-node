export class Utils {
    private static _instance = new Utils();
    private constructor() { }

    static get instance() {
        return this._instance;
    }

    // Get Unix Timestamp
    getUnix() {
        return Math.floor(+new Date / 1000)        
    }

    // Output Function
    sendOutput(message: string | null = null, data = null) {
        return {
            message: message,
            data: data
        }
    }

    // Verify Function
    verify = (datas: string[] = [], params: object) => {
        let ok: boolean = true

        for (let data of datas) {
            if (!params.hasOwnProperty(data))
                ok = false;
        }
        return ok
    }
}

export const utils = Utils.instance;