import { DataVector } from './DataVector';
import { Dual } from './Dual';

class CubicSpline {
    private _data: DataVector;

    constructor() {
      this._data = new DataVector();
    }

    public addDual(pX: number, pY: number) {
      this._data.add(new Dual(pX, pY));
    }
    public interpolate(pPoints: number[]): Array<Dual> {
      if (this._data.isEmpty()) {
        return null;
      }
      let lPointscount = pPoints.length;
      let lResult: Dual[] = [];

      this._data.sort();

      let lS = this.getSplineCoefficients();

      for (let i = 0; i < lPointscount; i++) {
        lResult[i] = new Dual(pPoints[i], this.interpolateDual(pPoints[i], lS));
      }

      return lResult;
    }

    private interpolateDual(pAlpha: number, pS: number[]) {
      const lN = this._data.Count;
      let lIdx;

      for (lIdx = 1; lIdx < lN; lIdx++) {
        if (pAlpha <= this._data.dual(lIdx).x) {
          break;
        }
      }
      lIdx = lIdx - 1;
      const lA = this._data.dual(lIdx + 1).x - pAlpha;
      const lB = pAlpha - this._data.dual(lIdx).x;

      const lH = this._data.dual(lIdx + 1).x - this._data.dual(lIdx).x;

      return lA * pS[lIdx] * (Math.pow(lA, 2) / lH - lH) / 6
          + lB * pS[lIdx + 1] * (Math.pow(lB, 2) / lH - lH) / 6
          + (lA * this._data.dual(lIdx).y + lB * this._data.dual(lIdx + 1).y)/lH;
    }

    public getSplineCoefficients(): number[] {
      if (this._data.isEmpty()) {
        return null;
      }

      let lH = [];
      let lSigma = [0, 0];
      let lTao = [0, 0];
      let lS = [0];
      lS[this._data.Count-1] = 0;

      const lN: number = this._data.Count;

      let lTemp;
      let lDIdx;

      for (let i = 1; i < lN - 1; i++) {
        lH[i - 1] = this._data.dual(i).x - this._data.dual(i - 1).x;
        lH[i] = this._data.dual(i + 1).x - this._data.dual(i).x;

        lTemp = (lH[i - 1] / lH[i]) * (lSigma[i] + 2) + 2;

        lSigma[i + 1] = -1 / lTemp;

        lDIdx = 6 * (((this._data.dual(i + 1).y - this._data.dual(i).y) / lH[i]) - ((this._data.dual(i).y - this._data.dual(i - 1).y) / lH[i - 1])) / lH[i];

        lTao[i + 1] = (lDIdx - lH[i - 1]/ lH[i] * lTao[i]) / lTemp;
      }

      let lBIdx;

      for (let k = 1; k < lN - 1; k++) {
        lBIdx = (lN - 1) - k;
        lS[lBIdx] = lSigma[lBIdx + 1] * lS[lBIdx + 1] + lTao[lBIdx + 1];
      }

      return lS;
    }
}

export { CubicSpline };
