interface IInvoice {
  customer: string;
  performances: IPerformance[];
}
interface IPerformance {
  playID: string;
  audience: number;
  play?: IPlay;
  amount?: Number;
}

interface IPlay {
  name: string;
  type: string;
}
interface IPlays {
  [name: string]: IPlay;
}

// function renderHtmlText(info) {

// }

export function statement(invoice: IInvoice, plays: IPlays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  console.log(statementData);
  return renderPlainText(statementData);

  function enrichPerformance(performance: IPerformance) {
    const play = playFor(performance);
    const amount = amountFor(performance);
    const result = { ...performance, play, amount };
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

  function totalAmount(data: any) {
    let totalAmount = 0;
    for (let perf of data.performances) {
      totalAmount += perf.amount;
    }
    return totalAmount;
  }

  function totalVolumeCredits(data: any) {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }
  function volumeCreditsFor(perf: IPerformance) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.play?.type) result += Math.floor(perf.audience / 5);
    return result;
  }
}

function renderPlainText(data: any) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }
}
