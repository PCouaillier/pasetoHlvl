export class MessageValidator {
    private readonly message: object;

    public constructor(message: object) {
        if (message instanceof String) {
            throw new Error('message is a string instead of object');
        }
        if (message instanceof Number) {
            throw new Error('message is a number instead of object');
        }
        if (message instanceof Array) {
            throw new Error('message is an Array instead of object');
        }
        this.message = message;
    }

    public isExpired(): boolean {
        const message: any = this.message;
        if (!message.exp) {
            return false;
        }
        return (message.exp instanceof Date ? message.exp : new Date(message.exp)) < new Date();
    }

    public isValid(): boolean {
        return !this.isExpired();
    }
}
