class Cell {
  constructor() {
    this.mark = undefined;
    this.sets = [];
  }

  addSet(set) {
    this.sets.push(set);
  }

  notify(mark) {
    this.mark = mark;
    let setComplete = false;
    for (let set of this.sets) {
      setComplete = set.update(this.mark);
      if (setComplete) {
        break;
      }
    }
    return setComplete;
  }
}

export default Cell