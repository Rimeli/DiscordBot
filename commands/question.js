// Get a trivia question and post it to the channel

const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder().setName('question').setDescription('Post a trivia question'),

    async execute(interaction) {
        // Do not timeout the interaction after 3 seconds
        interaction.deferReply();

        // Get the question
        var jsonQuestion = await getQuestion();
        if (jsonQuestion === '{}') {
            interaction.editReply('Question fetching error!');
            return;
        }
        const question = jsonQuestion.results[0].question;
        const correctAnswer = jsonQuestion.results[0].correct_answer;

        // Create the answer buttons and send the question alongside
        const answerButtons = createAnswerButtons(jsonQuestion);
        interaction.channel.send({ content: question, components: [answerButtons] });

        // Wait and collect all answer buttons click
        const questionTimeout = 10000;
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: questionTimeout });
        collector.on('collect', i => {
            i.reply({ content: `You clicked on the ${i.customId} button`, ephemeral: true });
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });

        await wait(questionTimeout);
        interaction.editReply(`The answer was ${correctAnswer}!`);
    }
};

// Make an HTTP GET request to get a question from a trivia database and return it as a JSON
async function getQuestion() {
    return new Promise((resolve, reject) => {
        https.get('https://opentdb.com/api.php?amount=1&type=multiple', res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                const jsonQuestion = JSON.parse(Buffer.concat(data).toString());
                if (jsonQuestion.response_code != 0) {
                    console.log(`Invalid question response code: ${jsonQuestion.response_code}`);
                    reject('{}');
                }
                resolve(jsonQuestion);
            });
        }).on('error', err => {
            console.log(`Question fetching error: ${err.message}`);
            reject('{}');
        });
    });
}

// Create the answer buttons associated to a question
function createAnswerButtons(jsonQuestion) {
    const results = jsonQuestion.results[0];
    const answerArray = [];

    // Fill and shuffle the answer array
    answerArray.push(results.correct_answer);
    results.incorrect_answers.forEach(function(answer) {
        answerArray.push(answer);
    });
    shuffleArray(answerArray);

    // Creat a button for each answer
    const buttonArray = [];
    answerArray.forEach(function(answer) {
        buttonArray.push(new MessageButton().setCustomId(answer).setLabel(answer).setStyle('PRIMARY'));
    });

    return new MessageActionRow().addComponents(buttonArray);
}

// Unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
function shuffleArray(array) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }
