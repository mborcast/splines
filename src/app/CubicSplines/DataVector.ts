import { Dual } from './Dual';

export class DataVector {
  private _vector: Array<Dual>;

  get Count() {
    return this._vector.length;
  }

  constructor() {
    this._vector = [];
  }

  public add(pDual: Dual): void {
    this._vector.push(pDual);
  }
  public isEmpty(): boolean {
    return (this.Count <= 0);
  }
  public dual(pIdx: number): Dual {
    return this._vector[pIdx];
  }

  public sort():void {
    let lTMin;
    let lIdxMin;

    for (let idx = 1; idx < this.Count - 1; idx++) {
      let i = idx - 1;
      lTMin = this._vector[i].x;
      lIdxMin = i;

      for (let j = i + 1; j < this.Count; j++) {
        if (lTMin > this._vector[j].x) {
          lTMin = this._vector[j].x;
          lIdxMin = j;
        }
      }
      if (lIdxMin != i) {
        this._vector[lIdxMin].x = this._vector[i].x;
        this._vector[i].x = lTMin;
        this._vector[lIdxMin].y = this._vector[i].y;
        this._vector[i].y = lTMin;
      }
    }
  }
}
