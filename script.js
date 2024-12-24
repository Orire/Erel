// Core app data
const letters = [
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל",
  "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"
];
const quickPhrases = [  "לא", "תודה", "שלום", "כן", "משקפיים", "טלפון", "לא נח", "בסדר"];
const predictions = {
  א: ["אני", "אנחנו"],
  ב: ["בית", "בסדר"],
  ג: ["גם", "גדול"],
  // Add more predictions as needed
};

// DOM elements
const textArea = document.getElementById("text-area");
const keyboard = document.getElementById("keyboard");
const predictionsDiv = document.getElementById("predictions");
const quickPhrasesDiv = document.getElementById("quick-phrases");
const speakButton = document.getElementById("speak-button");

// State
let input = "";
let currentWord = "";

// Functions
function updateTextArea() {
  textArea.innerText = input;
}

function handleKeyPress(letter) {
  input += letter;
  currentWord += letter;
  updateTextArea();
  updatePredictions(letter);
  if ("vibrate" in navigator) navigator.vibrate(50); // Haptic feedback
}

function handleSpace() {
  input += " ";
  currentWord = "";
  updateTextArea();
}

function handleErase() {
  if (input.length > 0) {
    input = input.slice(0, -1);
    currentWord = currentWord.slice(0, -1);
    updateTextArea();
    updatePredictions();
  }
}

function handleClearWord() {
  const words = input.trim().split(" ");
  input = words.slice(0, -1).join(" ") + " ";
  currentWord = "";
  updateTextArea();
  updatePredictions();
}

function handleQuickPhrase(phrase) {
  input += phrase + " ";
  updateTextArea();
  currentWord = "";
  updatePredictions();
}

function updatePredictions(letter) {
  predictionsDiv.innerHTML = "";
  const nextPredictions = predictions[currentWord[0]] || [];
  nextPredictions.forEach((word) => {
    const button = document.createElement("button");
    button.innerText = word;
    button.className = "prediction";
    button.onclick = () => handleQuickPhrase(word);
    predictionsDiv.appendChild(button);
  });
}

function handleSpeak() {
  const utterance = new SpeechSynthesisUtterance(input);
  utterance.lang = "he-IL";
  speechSynthesis.speak(utterance);
}

// Render Keyboard
letters.forEach((letter) => {
  const button = document.createElement("button");
  button.className = "key";
  button.innerText = letter;
  button.onclick = () => handleKeyPress(letter);
  keyboard.appendChild(button);
});

// Add space bar
const spaceBar = document.createElement("button");
spaceBar.className = "key special";
spaceBar.innerText = "רווח";
spaceBar.onclick = handleSpace;
keyboard.appendChild(spaceBar);

// Add erase and clear word buttons
const eraseButton = document.createElement("button");
eraseButton.className = "key special";
eraseButton.innerText = "מחק";
eraseButton.onclick = handleErase;
keyboard.appendChild(eraseButton);

const clearWordButton = document.createElement("button");
clearWordButton.className = "key special";
clearWordButton.innerText = "מחק מילה";
clearWordButton.onclick = handleClearWord;
keyboard.appendChild(clearWordButton);

// Render Quick Phrases
quickPhrases.forEach((phrase) => {
  const button = document.createElement("button");
  button.className = "quick-phrase";
  button.innerText = phrase;
  button.onclick = () => handleQuickPhrase(phrase);
  quickPhrasesDiv.appendChild(button);
});

// Add event listeners
speakButton.onclick = handleSpeak;

// Initial render
updateTextArea();
