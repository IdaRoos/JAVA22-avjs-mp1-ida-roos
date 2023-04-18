const scoreDiv = document.getElementById("score-list");

// Fetches the highscores from a Firebase database, sorts them by score, and displays them on the page
export async function getHighscore() {
  const url =
    "https://highscore-d0cb5-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";
  const response = await fetch(url);
  const data = await response.json();

  const highScore = Object.entries(data);

  highScore.sort((a, b) => b[1].score - a[1].score);

  for (const [key, userObj] of highScore) {
    const name = userObj.name;
    const score = userObj.score;
    const ol = document.createElement("ul");
    const nameP = document.createElement("li");
    const scoreP = document.createElement("li");
    nameP.innerText = "Name: " + name;
    scoreP.innerText = "Score: " + score;
    scoreDiv.append(ol);
    ol.append(nameP, scoreP);
  }
}

// Adds a highscore to the Firebase database if the score is higher than the lowest score in the database
export async function addHighscore(name, score) {
  const url =
    "https://highscore-d0cb5-default-rtdb.europe-west1.firebasedatabase.app/highscores.json";
  const response = await fetch(url);
  const data = await response.json();
  const highScore = Object.entries(data);

  let lowestScore = Infinity;
  let lowestScoreKey = null;

  for (const [key, userObj] of highScore) {
    if (userObj.score < lowestScore) {
      lowestScore = userObj.score;
      lowestScoreKey = key;
    }
  }

  // Replace the lowest score if the new score is higher
  if (score > lowestScore) {
    patchFunction(name, score, lowestScoreKey);
  }
  await getHighscore();
}

// Sends a PATCH request to update the highscore in the Firebase database
export async function patchFunction(inputName, inputScore, key) {
  const newURL = `https://highscore-d0cb5-default-rtdb.europe-west1.firebasedatabase.app/highscores/${key}.json`;

  const newHighscore = {
    name: inputName,
    score: inputScore,
  };

  const options = {
    method: "PATCH",
    body: JSON.stringify(newHighscore),
    headers: {
      "Content-type": "application/json",
    },
  };

  const newResponse = await fetch(newURL, options);
  await newResponse.json();
}
