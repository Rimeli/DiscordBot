// Requirements
const fs = require('fs');
const { Client,Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

// Filling client events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        // client.once('ready', () => {});
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        // client.on('interactionCreate', async interaction => {});
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Filling client commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// Login to Discord with your client's token
client.login(token);
