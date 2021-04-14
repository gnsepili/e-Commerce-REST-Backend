class CustomErrorHandler extends Error {
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message)
    };
    static userNotExist(message) {
        return new CustomErrorHandler(401, message)
    };
    static unAutherised(message) {
        return new CustomErrorHandler(401, message)
    };
    static wrongCredential(message) {
        return new CustomErrorHandler(401, message)
    };
    
}

export default CustomErrorHandler;