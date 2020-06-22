class Event {

    constructor(name, description) {
        this.name = name;
        this.description = description
    }
}

class Interval {

    constructor(date, duration, forwardVisibility, backwardVisibility) {
        this.date = date;
        this.duration = duration;
        this.forwardVisibility = forwardVisibility;
        this.backwardVisibility = backwardVisibility;
    }
}
