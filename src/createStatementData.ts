import { IInvoice, IPlay, IPlays, IPerformance } from "./IInvoice";

class PerformanceCalculator {
  play: IPlay;
  performance: IPerformance;
  constructor(performance: IPerformance, play: IPlay) {
    this.performance = performance;
    this.play = play;
  }
  get amount(): number {
    throw new Error("サブクラスの担当だよ！！");
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;
    const TRAGEDY_BASE_USD = 40000;
    result = TRAGEDY_BASE_USD;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;
    const COMEDY_BASE_USD = 30000;
    result = COMEDY_BASE_USD;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
}

function createPerfomanceCalculator(performance: IPerformance, play: IPlay) {
  switch (play.type) {
    case "tragedy":
      return new TragedyCalculator(performance, play);
    case "comedy":
      return new ComedyCalculator(performance, play);
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

export function createStatementData(invoice: IInvoice, plays: IPlays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function enrichPerformance(performance: IPerformance) {
    const calculator = createPerfomanceCalculator(
      performance,
      playFor(performance)
    );
    const play = calculator.play;
    const amount = calculator.amount;
    const result = { ...performance, play, amount };
    return result;
  }

  function playFor(perf: IPerformance) {
    return plays[perf.playID];
  }

  function totalAmount(data: any) {
    return data.performances.reduce((total: number, p: IPerformance) => {
      return total + (p.amount ? p.amount : 0);
    }, 0);
  }
  function totalVolumeCredits(data: any) {
    return data.performances.reduce((total: number, p: IPerformance) => {
      return total + volumeCreditsFor(p);
    }, 0);
  }
  function volumeCreditsFor(perf: IPerformance) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.play?.type) result += Math.floor(perf.audience / 5);
    return result;
  }
}
