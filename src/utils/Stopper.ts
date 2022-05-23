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

  final() {
    this.state = stopperEnum.last;
  }

  stop() {
    this.state = stopperEnum.stop;
  }
}
