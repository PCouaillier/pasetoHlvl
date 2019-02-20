export class Duration {

    public static shortDuration(minutes: number, hours: number = 0, days: number = 0): Duration {
        return new Duration(0, 0, days, hours, minutes);
    }

    public constructor(
        private years: number = 0,
        private month: number = 0,
        private days: number = 0,
        private hours: number = 0,
        private minutes: number = 0) {
    }

    public getExpiration(): Readonly<Date> {
        const expDate = new Date();
        expDate.setFullYear(expDate.getFullYear() + this.years);
        expDate.setMonth(expDate.getMonth() + this.month);
        expDate.setDate(expDate.getDate() + this.days);
        expDate.setHours(expDate.getHours() + this.hours);
        expDate.setMinutes(expDate.getMinutes() + this.minutes);
        return Object.freeze(expDate);
    }
}
