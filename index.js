const { Client, RichEmbed, Collection} = require("discord.js");
const client = new Client({
    disableEveryone: true,
});

client.commands = new Collection();
client.aliases = new Collection();

// require('./handler/command')(client);
["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
})

const {token, prefix} = require('./config.json')

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
//For avoiding Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port', app.get('port'));
});

client.on('ready', () => {
    client.user.setPresence({
        status: "online",
        game: {
            name: "Use !!help",
            type: 0
        }
    });
});

/**
 * When new user joins, adds Visitor role
 * Sends welcome message
 */
client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Visitor"));
    var channel = guildMember.guild.channels.find(ele => ele.name === "come-and-go");
    var registration = guildMember.guild.channels.find(ele => ele.name === "registration");
    channel.send(`Welcome to the STCA, <@` + guildMember.id + `>! If you are a student, head over to <#${registration.id}>!`); 
});

/**
 * When user leaves, sends leaving message
 */
client.on('guildMemberRemove', member => {
    var channel = member.guild.channels.find(ele => ele.name === "come-and-go");
    channel.send(`${member.user.tag} just left the server!`);
    Ranks.findOne({userID: member.user.id},
        (err, ranks) => {
            if (ranks) ranks.delete();
        });
});

/**
 * Deletes the message of the user (the bot commmand)
 * Deletes last message of the bot (the bot response to the command)
 * @param message the message to be deleted
 */
deleteMessages = (message) => {
    message.channel.fetchMessages({ limit: 1 }).then(messages => {
        let lastMessage = messages.first();
        if (lastMessage.author.bot) {
            lastMessage.delete(timeout);
        }
    }).catch(console.error);
    message.delete(timeout);
}

/**
 * Run when bot sees a message for commands
 */
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;
    if (!message.member) message.guild.fetchMember(message).then(member => message.member = member);
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        command.run(client, message, args);
    } else {
        message.channel.send("I do not recognize that command!");
    }
});

client.login(token);
