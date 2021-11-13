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
        let jsonQuestion = await getQuestion();
        if (jsonQuestion === '{}') {
            interaction.editReply('Question fetching error!');
            return;
        }
        const question = Buffer.from(jsonQuestion.results[0].question, 'base64').toString('utf-8');
        const correctAnswer = Buffer.from(jsonQuestion.results[0].correct_answer, 'base64').toString('utf-8');

        // Debug
        // console.log(`The answer is ${correctAnswer}`);

        // Create the answer buttons and send the question alongside
        const answerButtons = createAnswerButtons(jsonQuestion);
        interaction.channel.send({ content: question, components: [answerButtons] });

        // Wait and collect all answer buttons click
        const usersAnswer = [];
        const questionTimeout = 10000;
        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: questionTimeout });
        collector.on('collect', i => {
            usersAnswer.push(createUserAnswer(i));
            i.reply({ content: `Your answer ${i.customId} has been registered!`, ephemeral: true });
        });

        let response = `The correct answer was **${correctAnswer}**.`;
        collector.on('end', () => {
            usersAnswer.forEach(function (userAnswer) {
                if (userAnswer.answer === correctAnswer) {
                    response = response.concat('\n', `<@${userAnswer.id}> found the correct answer, **congratulation**!`);
                }
            });
        });

        await wait(questionTimeout);
        await interaction.editReply('The question has timed up.');
        await interaction.followUp(response)
    }
};

// Make an HTTP GET request to get a question from a trivia database and return it as a JSON
async function getQuestion() {
    return new Promise((resolve, reject) => {
        // The answer is encoded in Base64 to avoid special characters to be broke
        https.get('https://opentdb.com/api.php?amount=1&type=multiple&encode=base64', res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                const jsonQuestion = JSON.parse(Buffer.concat(data).toString('utf-8'));
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
    answerArray.push(Buffer.from(results.correct_answer, 'base64').toString('utf-8'));
    results.incorrect_answers.forEach(function (answer) {
        answerArray.push(Buffer.from(answer, 'base64').toString('utf-8'));
    });
    shuffleArray(answerArray);

    // Create a button for each answer
    const buttonArray = [];
    answerArray.forEach(function (answer) {
        buttonArray.push(new MessageButton().setCustomId(answer).setLabel(answer).setStyle('PRIMARY'));
    });

    return new MessageActionRow().addComponents(buttonArray);
}

// Unbiased shuffle algorithm (the Fisher-Yates (aka Knuth) Shuffle)
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

// Create an user answer object from an answer button click
function createUserAnswer(interaction) {
    return { id: interaction.user.id, answer: interaction.customId };
}
