export function randomChoices(population, weights, k = 1) {
  // 處理錯誤狀況
  if (population.length !== weights.length) {
    throw new Error("population's length is not equal to weights' length");
  }

  if (
    weights.some((weight) => weight < 0) ||
    weights.every((weight) => weight === 0) ||
    weights.length === 0
  ) {
    throw new Error("wrong weight value");
  }

  if (Number.isInteger(k)) {
    throw new Error("wrong 'k'");
  }

  const totalWeight = sum(weights);
  const cumulativeWeights = [];
  let cumulativeWeight = 0;
  for (const weight of weights) {
    cumulativeWeight += weight;
    cumulativeWeights.push(cumulativeWeight);
  }

  let result = [];
  loop(k, () => {
    const r = Math.random() * totalWeight;
    for (i = 0; i < cumulativeWeights.length; i++) {
      if (r < cumulativeWeights[i]) {
        result.push(population[i]);
        break;
      }
    }
  });
}

export function sum(values) {
  let result = 0;
  for (const n of values) {
    result += n;
  }
  return result;
}

export function loop(times, func) {
  for (let i = 0; i < times; i++) {
    func();
  }
}
