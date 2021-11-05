module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot ready and logged in as ${client.user.tag}`);
    }
};
