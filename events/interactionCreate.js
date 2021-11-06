// Sent when a user is interacting with the bot

module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                return;
            }

            try {
                command.execute(interaction);
            } catch (error) {
                console.error(`Command error: ${error}`);
                interaction.reply({ content: `Error during the execution of the command ${commandName}` });
            }
        }
    }
};