interface IInvoice {
  customer: string;
  performances: IPerformance[];
}
interface IPerformance {
  playID: string;
  audience: number;
  play: IPlay;
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
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  return renderPlainText(statementData);

  function enrichPerformance(performance: IPerformance) {
    const play = playFor(performance);
    const result = { ...performance, play };
    return result;
  }

  function playFor(perf: IPerformance) {
    return plays[perf.playID];
  }
}

function renderPlainText(data: any) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmounts())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function totalAmounts() {
    let totalAmount = 0;
    for (let perf of data.performances) {
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

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function volumeCreditsFor(perf: IPerformance) {
    let result = Math.max(perf.audience - 30, 0);
    if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
    return result;
  }

  function amountFor(perf: IPerformance) {
    let result = 0;
    switch (perf.play.type) {
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
        throw new Error(`unknown type: ${perf.play.type}`);
    }
  }
}
