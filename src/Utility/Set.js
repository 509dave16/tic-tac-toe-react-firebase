class Set
{
  constructor(size) {
    this.size = size;
    this.initialMark = undefined;
    this.numOfMarks = 0;
  }

  update(mark)
  {
    let complete = false;
    if(!this.initialMark) {
      this.initialMark = mark;
    }
    let  mixed = this.initialMark !== mark;
    if(!mixed) {
      this.numOfMarks++;
      complete = this.numOfMarks === this.size;
    }
    
    return complete;
  };
}

export default Set
