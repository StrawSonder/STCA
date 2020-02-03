const { Client, RichEmbed, Collection} = require("discord.js");
const client = new Client({
    disableEveryone: true
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
    console.log('App is running, server is listening on port ', app.get('port'));
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    guild = client.guilds.get('667901183909953565');
    //main 665396787963625491
    //test 667901183909953565
    client.user.setPresence({
        status: "online",
        game: {
            name: "Figuring stuff out",
            type: "PLAYING"
        }
    });
})

/**
 * When new user joins, adds Visitor role
 * Sends welcome message
 */
client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Visitor"));
    guildMember.guild.channels.get('667773048732254244').send(`Welcome to the STCA, <@` + guildMember.id + `>! If you are a student, head over to #registration !`); 
    //main 667773048732254244
    //test 667901183909953569
})

/**
 * When user leaves, sends leaving message
 */
client.on('guildMemberRemove', member => {
    member.guild.channels.get('667773048732254244').send(`${member.user.tag} just left the server!`);
    //main 667773048732254244
    //test 667901183909953569
    var ind = ranks.findIndex(ele => ele.id == member.id);
    if (ind != -1) {
        ranks.splice(ind, 1);
    }
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
    const cannotUse = "I'm sorry, you cannot use that command.";
    const rankings = "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\n"
        + "ex. !!register C B A S";

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        command.run(client, message, args);
    }
});

client.login(token);
