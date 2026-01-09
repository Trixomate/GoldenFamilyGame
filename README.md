<div align="center">
<!-- <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> -->
<img width="1200" height="250" alt="GoldenFamilyGame" src="doc/logo.png">
</div>

# About Golden Family Game

**GoldenFamilyGame** is a web-based interactive game inspired by the famous TV show "Family Feud" (Une Famille en Or). It allows you to host game nights, track team scores, and reveal answers on a dynamic board.

## 🚀 Access the Game

The game is deployed on GitHub Pages and can be accessed here:
👉 **[Play GoldenFamilyGame](https://trixomate.github.io/GoldenFamilyGame/)**

## 🎮 How to Play

1. **Start the Game**: The game loads with a default set of questions.
2. **Gameplay**:
   - **Reveal Answers**: Click on the hidden panels to reveal answers and points.
   - **Strikes**: Click the **X** button to trigger a strike (wrong answer).
   - **Team Scores**: Click on the score display to edit team names or manually adjust points.
   - **Navigation**: Use the controls to move between questions.

## ⚙️ Custom Questions (YAML)

You can play with your own custom questions by creating a YAML file and loading it into the game.

### How to Load Your File
On the home page, click “Custom Game.”
In the pop-up window, simply **drag and drop** your `.yaml` file anywhere in the drop zone or click on it to select a file from your computer.
Your YAML file will be checked, and if everything is in order, a green “Load Game Data” button will appear.
If you click on it, the pop-up window will close and the button will change to a “Start Custom Game” button, which will launch the game with your new questions.

Translated with DeepL.com (free version)

### YAML File Structure
Create a file named `questions.yaml` (or any name ending in `.yaml`). The file must follow this structure:

#### Transition
- `type`: type of slide **transition**.
- `title`: The title of your **transition**.
- `subtitle`: The subtitle of your **transition**.

#### Question
- `type`: type of slide **question**.
- `questions`: The text of the question.
- `answers`: A list of answers (between 3 and 8).
    - `text`: The answer text.
    - `percentage`: The percentage for that answer.

### Example `questions.yaml`

Copy and paste this into a file to test:

```yaml
- type: transition
  title: "Round 1"
  subtitle: "Let's start easy!"

- type: question
  question: "Name something people often lose"
  answers:
    - text: "Keys"
      percentage: 35
    - text: "Phone"
      percentage: 25
    - text: "TV Remote"
      percentage: 15
    - text: "Patience"
      percentage: 10
```