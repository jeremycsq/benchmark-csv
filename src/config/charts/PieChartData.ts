// PieChartData.ts
export interface PieChartData {
  overall: number[]
  newVisitors: number[]
  returningVisitors: number[]
}

function randomPieValues(): number[] {
  const arr = [
    +(Math.random() * 30 + 60).toFixed(1),
    +(Math.random() * 30 + 40).toFixed(1),
    +(Math.random() * 20 + 20).toFixed(1),
  ]
  return arr.sort((a, b) => b - a)
}

export function randomizePieChartData(): PieChartData {
  return {
    overall: randomPieValues(),
    newVisitors: randomPieValues(),
    returningVisitors: randomPieValues(),
  }
}
