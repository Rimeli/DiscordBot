// Sent when the bot has been started and is ready to respond to commands

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot ready and logged in as ${client.user.tag}`);
    }
};
