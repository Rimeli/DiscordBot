module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction`);

        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            try {
                command.execute(interaction);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: `Error during the execution of the command ${commandName}` });
            }
        }
    }
};