export enum stopperEnum {
  continue,
  last, // process the return value, but stop iteration
  stop, //do not process the return value - stop immediately
}

export class Stopper {
  public state = stopperEnum.continue;

  get isActive() {
    return this.state === stopperEnum.continue;
  }

  get isStopped() {
    return this.state === stopperEnum.stop;
  }

  get isComplete() {
    return this.state !== stopperEnum.continue;
  }

  get isLast() {
    return this.state === stopperEnum.last;
  }

  stopAfterThis() {
    this.state = stopperEnum.last;
  }

  stop() {
    // stop and DO NOT USE the last returned value
    this.state = stopperEnum.stop;
  }
}
