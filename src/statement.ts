import { IInvoice, IPlays } from "./IInvoice";
import { createStatementData } from "./createStatementData";

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

export function statement(invoice: IInvoice, plays: IPlays) {
  const statementData = createStatementData(invoice, plays);
  return renderPlainText(statementData);
}

// function renderPlainHTML(data: any) {
//   let result = `<h1>Statement for ${data.customer}</h1>`;
//   result += `<ul>`;
//   for (let perf of data.performances) {
//     result += `<li> ${perf.play.name}: ${usd(perf.amount)} (${
//       perf.audience
//     } seats)</li>`;
//   }
//   result += `</ul>`;
//   result += `<div>Amount owed is ${usd(data.totalAmount)}</div>`;
//   result += `<div>You earned ${data.totalVolumeCredits} credits</div>`;
//   return result;

//   function usd(aNumber: number) {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     }).format(aNumber / 100);
//   }
// }
