interface IInvoice {
  customer: string;
  performance: IPerformance[];
}
interface IPerformance {
  playID: string;
  audience: number;
}

interface IPlay {
  name: string;
  type: string;
}
interface IPlays {
  [name: string]: IPlay;
}

export function statement(invoice: IInvoice, plays: IPlays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performance) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmounts(invoice.performance))}\n`;
  result += `You earned ${totalVolumeCredits(invoice.performance)} credits\n`;
  return result;

  function totalAmounts(performance: IPerformance[]) {
    let totalAmount = 0;
    for (let perf of invoice.performance) {
      totalAmount += amountFor(perf);
    }
    return totalAmount;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function totalVolumeCredits(performance: IPerformance[]) {
    let result = 0;
    for (let perf of performance) {
      result += volumeCreditsFor(perf, playFor(perf));
    }
    return result;
  }

  function volumeCreditsFor(perf: IPerformance, play: IPlay) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === play.type) result += Math.floor(perf.audience / 5);
    return result;
  }
  function playFor(perf: IPerformance) {
    return plays[perf.playID];
  }
  function amountFor(perf: IPerformance) {
    let result = 0;
    switch (playFor(perf).type) {
      case "tragedy":
        const TRAGEDY_BASE_USD = 40000;
        result = TRAGEDY_BASE_USD;
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30);
        }
        return result;
      case "comedy":
        const COMEDY_BASE_USD = 30000;
        result = COMEDY_BASE_USD;
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20);
        }
        result += 300 * perf.audience;
        return result;
      default:
        throw new Error(`unknown type: ${playFor(perf).type}`);
    }
  }
}
