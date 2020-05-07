import { statement } from "./statement";

test("一定の観客数までは固定金額を請求する", () => {
  const invoice = {
    customer: "Walt",
    performances: [
      {
        playID: "hamlet",
        audience: 30,
      },
      {
        playID: "as-like",
        audience: 20,
      },
      {
        playID: "othello",
        audience: 10,
      },
    ],
  };
  const plays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };

  const result = statement(invoice, plays);
  expect(result).toBe(`Statement for Walt
 Hamlet: $400.00 (30 seats)
 As You Like It: $360.00 (20 seats)
 Othello: $400.00 (10 seats)
Amount owed is $1,160.00
You earned 4 credits
`);
});

test("観客数に応じて課金される", () => {
  const invoice = {
    customer: "BigCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  };
  const plays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };

  const result = statement(invoice, plays);
  expect(result).toBe(`Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`);
});
