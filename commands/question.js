const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

const timeout = 10000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('question')
        .setDescription('Post a trivia question'),
    async execute(interaction) {
        interaction.deferReply();

        const row = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('one').setLabel('1').setStyle('PRIMARY'),
            new MessageButton().setCustomId('two').setLabel('2').setStyle('PRIMARY'),
            new MessageButton().setCustomId('three').setLabel('3').setStyle('PRIMARY'),
            new MessageButton().setCustomId('four').setLabel('4').setStyle('PRIMARY')
        );
        interaction.channel.send({ content: "This is the question!", components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: timeout });
        collector.on('collect', i => {
            i.reply({ content: `You clicked on the ${i.customId} button`, ephemeral: true });
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });

        await wait(timeout);
        interaction.editReply('The answer was one!');
    }
};
