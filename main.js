const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const wordInput = document.getElementById("wordInput");
const searchButton = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const error = document.getElementById("error");

searchButton.addEventListener('click', () => {
    const word = wordInput.value.trim();

    resultsDiv.textContent = '';
    error.style.display = 'none';

    if (word) {
        fetchWordData(word);
    }
    wordInput.value = '';  // Clear the input field after search
});

async function fetchWordData(word) {
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `<p class="info-text">Searching for "${word}"...</p>`;

    try {
        const response = await fetch(`${BASE_URL}${word}`);

        if (!response.ok) {
            error.innerHTML = `<p class="error-text">We couldn't find the word "${word}". Try another Word!</p>`;
            error.style.display = 'block';
            resultsDiv.style.display = 'none';
    return;
}
            const data = await response.json();
            displayResults(data[0]);

    } catch (err) {
        error.innerHTML = `<p class="error-text">${err.message}</p>`;
        error.style.display = 'block';
    }
}

function displayResults(data) {
   // 1. Get the main parts of the data
const word = data.word;
const firstMeaning = data.meanings[0];

// 2. Get the word type (noun, verb, etc.)
const partOfSpeech = firstMeaning.partOfSpeech;

// 3. Find the first available phonetic text and audio
let phoneticText = "";
for (let p of data.phonetics) {
    if (p.text) {
        phoneticText = p.text;
        break; // Stop looking once we find one
    }
}

let audioSrc = "";
for (let p of data.phonetics) {
    if (p.audio) {
        audioSrc = p.audio;
        break;
    }
}

// 4. Get up to 3 definitions and turn them into list items
let definitionsHTML = "";
const definitions = firstMeaning.definitions;

for (let i = 0; i < definitions.length && i < 3; i++) {
    definitionsHTML += "<li>" + definitions[i].definition + "</li>";
}

// 5. Get up to 4 synonyms as a simple string
let synonymsList = firstMeaning.synonyms.slice(0, 4);
let synonymsHTML = "None";

if (synonymsList.length > 0) {
    synonymsHTML = synonymsList.join(", ");
}

    resultsDiv.innerHTML = `
        <div>
            <div class="word-header">
                <h2 class="word-title">${word}</h2>
                <p class="part-speech">${partOfSpeech}</p>
            </div>

            ${phoneticText ? `<h3 class="pronunciation">Pronunciation:</h3>
                <p class="phonetic-text">${phoneticText}</p>` : ''}

            ${audioSrc ? `
                <div class="audio-container">
                    <h2 class="audio-title">Listen:</h2>
                    <audio controls preload="metadata" class="audio-player">
                        <source src="${audioSrc}" type="audio/mpeg">
                        Your browser doesn't support audio.
                    </audio>
                </div>
            ` : ''}

            <div class="definitions">
                <h3>Definitions:</h3>
                <ul>${definitionsHTML || '<li>No definitions found</li>'}</ul>
            </div>

            ${synonymsHTML !== 'None' ? `
                <div class="synonyms">
                    <h3>Synonyms:</h3>
                    <p>${synonymsHTML}</p>
                </div>
            ` : ''}
        </div>
    `;
}