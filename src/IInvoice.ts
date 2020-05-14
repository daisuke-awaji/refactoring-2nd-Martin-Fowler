export interface IInvoice {
  customer: string;
  performances: IPerformance[];
}
export interface IPerformance {
  playID: string;
  audience: number;
  play?: IPlay;
  amount?: number;
}
export interface IPlay {
  name: string;
  type: string;
}
export interface IPlays {
  [name: string]: IPlay;
}
