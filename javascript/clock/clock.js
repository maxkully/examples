//
// This is only a SKELETON file for the 'Clock' exercise. It's been provided as a
// convenience to get you started writing code faster.
//
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export class Clock {
  constructor(hours = 0, minutes = 0) {
    this.hours = hours;
    this.minutes = minutes;

    this.rolling()
  }

  rolling() {
    const hours = Math.floor(this.minutes / MINUTES_IN_HOUR);

    this.minutes = this.minutes % MINUTES_IN_HOUR;
    this.hours = (this.hours + hours) % HOURS_IN_DAY;

    if (this.minutes < 0) this.minutes = MINUTES_IN_HOUR + this.minutes;
    if (this.hours < 0) this.hours = HOURS_IN_DAY + this.hours;
  }

  toString() {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
  }

  plus(minutes = 0) {
    this.minutes += minutes;
    this.rolling();

    return this;
  }

  minus(minutes = 0) {
    this.minutes -= minutes;
    this.rolling();

    return this;
  }

  equals(clock) {
    return this.toString() === clock.toString();
  }
}
