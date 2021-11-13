# DiscordBot

Simple trivia bot for Discord.

# Context

I wanted a trivia Discord bot for my own server but I couldn't find one working properly or simple enough (most Discord bots are bloated with useless features in my opinion).

This was a good occasion for me to satisfy my curiosity on how Discord bots are made alongside fulfilling my needs.

This bot has been developped with Node.js and mainly rely on the [Discord.js module](https://github.com/discordjs/discord.js) to communicate with the [Discord's API](https://discord.com/developers/docs/intro).

The questions are retrieved on the go from a [free online open trivia database](https://opentdb.com/).

# Commands

This bot uses the [latest slash commands proposed by Discord](https://blog.discord.com/slash-commands-are-here-8db0a385d9e6), this has been a bit troublesome as most of online tutorials are outdated and not based on this.

Here is the documentation of the available commands, how to use them and how they work.

## Ping

The `/ping` command has no argument and makes the bot answering with a `pong!` message.

## Question

The `/question` command has no argument and is the main command of this bot.

Once the command is received by the bot, it makes a HTTP call to the trivia database's REST API.

It only asks for a single random question (it must must be a multiple answers question though) encoded in Base64 to avoid messing with special characters.

Once the answer is received and decoded, the bot posts the question alongside buttons representing the answers and waits for 10 secondes. 

During this time, it collects all the answer made by users, when the question times out, it displays the correct answer and the winner's username is there is one.

# Events

The bot reacts to the following events thrown by Discord.

## Ready

When the `ready` event is received the bot only prints a ready message in the console.

## Interaction Create

When the `interactionCreate` event is received the bot checks if the interaction is a slash command, if so it executes the associated command if it exists.

# Deployment

To deploy the commands to the Discord servers on which the bot is, execute `node deploy-commands.js` in your console.

# Usage

Once this is done, you can launch the bot by executing `node main.js` in your console.

# What's next

Here is the list of the next features I would like to work on :

- Allow a user to change its answer
- Create a session with a users ranking at the end
- Ask a specific question (by category or difficulty)

# License

As stated in the `LICENSE` file, this bot is released under [MIT licence](https://en.wikipedia.org/wiki/MIT_License).
