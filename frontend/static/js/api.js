async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
}

export async function fetchHighestScores() {
  return fetchJSON("/api/highest-scores");
}

export async function updateHighestScore(gridSize, score) {
  return fetchJSON("/api/highest-scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ grid_size: gridSize, score }),
  });
}
