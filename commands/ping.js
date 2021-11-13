// Send back a ping message

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),

    async execute(interaction) {
        await interaction.reply('pong!');
    }
};
