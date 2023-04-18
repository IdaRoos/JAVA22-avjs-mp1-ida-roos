import { addHighscore, getHighscore } from "./highscore.js";

export class Game {
  constructor() {
    // Initialize variables to store HTML elements
    this.textFromInput = "Anonymous player";
    this.playerName = document.querySelector("#player");
    this.gameContainer = document.querySelector("#gameContainer");
    this.computerText = document.querySelector("#computer");
    this.resultText = document.querySelector("#resultText");
    this.choiceBtn = document.querySelectorAll(".choiceBtn");
    this.playerScoreText = document.querySelector("#scorePlayer");

    this.playerChoice;
    this.computerChoice;

    this.playerScore = 0;
    this.computerScore = 0;

    this.nameInput = document.querySelector("#inputName");
    this.nameButton = document.querySelector("#buttonName");
    this.nameButton.addEventListener("click", this.handleNameSubmit.bind(this));
    this.choiceBtn.forEach((button) =>
      button.addEventListener("click", this.handleChoiceClick.bind(this))
    );
  }

  // Handle submit event for player name input
  handleNameSubmit(event) {
    event.preventDefault();
    this.textFromInput =
      this.nameInput.value === "" ? "Anonymous player" : this.nameInput.value;
    this.playerName.innerText = this.textFromInput + ": ";
    document.querySelector("form").innerHTML = "";
    this.resultText.innerText = "Let's play!";
  }

  // Handle click event for player choice buttons
  handleChoiceClick(event) {
    this.playerChoice = event.target.value;
    this.playerName.textContent = `${this.textFromInput}: ${this.playerChoice}`;
    this.computerChoiceFunc();
    this.computerText.textContent = `Computer: ${this.computerChoice}`;
    this.resultText.textContent = this.checkWinner();
    this.playerScoreText.textContent = `Your score: ${this.playerScore}`;
    this.endGame();
  }

  // Generate a random number to select computer's choice
  computerChoiceFunc() {
    let randomNumb = this.getRandomNumber();
    switch (randomNumb) {
      case 1:
        this.computerChoice = "ROCK";
        break;
      case 2:
        this.computerChoice = "PAPER";
        break;
      case 3:
        this.computerChoice = "SCISSORS";
        break;
    }
  }

  // Check if player or computer is winner
  checkWinner() {
    if (this.playerChoice === this.computerChoice) {
      return "It's a tie!";
    } else if (this.computerChoice === "ROCK") {
      if (this.playerChoice === "PAPER") {
        this.playerScore++;
        return `You win! Paper beats rock.`;
      } else {
        this.computerScore++;
        return "You lose... Paper beats rock.";
      }
    } else if (this.computerChoice === "PAPER") {
      if (this.playerChoice === "SCISSORS") {
        this.playerScore++;
        return "You win! Scissors beats paper.";
      } else {
        this.computerScore++;
        return "You lose... Paper beats rock.";
      }
    } else if (this.computerChoice === "SCISSORS") {
      if (this.playerChoice === "ROCK") {
        this.playerScore++;
        return "You win! Rock beats scissors";
      } else {
        this.computerScore++;
        return "You lose... Scissors beats paper.";
      }
    }
  }
  // If computer gets 1 point, end game and call highscore functions
  async endGame() {
    if (this.computerScore === 1) {
      await addHighscore(this.textFromInput, this.playerScore);
      // update the highscore list
      const scoreDiv = document.getElementById("score-list");
      scoreDiv.innerHTML = ""; // clear the scoreDiv
      await getHighscore(); // call getHighscore again to update the list
      const playAgainBtn = document.createElement("button");
      playAgainBtn.classList.add("playAgain");
      playAgainBtn.innerText = "Play again";
      const winnerText = "You lost...Your score is: " + this.playerScore;
      const gameChoice = document.querySelector("#gameChoice");
      gameChoice.remove();
      this.resultText.innerText = `${winnerText} `;
      this.gameContainer.append(playAgainBtn);
      playAgainBtn.addEventListener("click", () => {
        location.reload();
      });
    }
  }

  getRandomNumber() {
    return Math.ceil(Math.random() * 3);
  }
}
