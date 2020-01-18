
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./config.json')
var Rank = require('./Rank.js');
var ranks = {};

var express = require('express');
var app     = express();

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
})

client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Visitor"));
    console.log(`${guildMember.user.tag} has gotten the visitor role.`);
    member.guild.channels.get('667773048732254244').send(`Welcome to the STCA, <@` + member.id + `>! If you are a student, head over to #registration !`); 
})

client.on('guildMemberRemove', member => {
    member.guild.channels.get('667773048732254244').send(`${member.user.tag} just left the server!`); 
});

//Dealing with registration roles
registration = (message, arr, add) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === add) {
            message.member.addRole(arr[i]);
        } else {
            message.member.removeRole(arr[i]);
        }
    }
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const cannotUse = "I'm sorry, you cannot use that command.";
    const rankings = "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\n"
        + "ex. !!register C B A S";
    const greeting = "Hello! I am the STCA\'s receptionist.\n";
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const timeout = 3000;
    var freshman = message.guild.roles.find(role => role.name === "Freshman");
    var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
    var junior = message.guild.roles.find(role => role.name === "Junior");
    var senior = message.guild.roles.find(role => role.name === "Senior");
    var visitor = message.guild.roles.find(role => role.name === "Visitor");
    var roles = [freshman, sophomore, junior, senior, visitor];
    var teacher = message.guild.roles.find(role => role.name === "Teacher");
    var offline = message.guild.roles.find(role => role.name === "Offline Teacher");

    if (command === 'register') {
        var arr, member, name, possessive, roleName;
        if (args.length == 5 && message.member.hasPermission("ADMINISTRATOR")) {
            arr = args.slice(1);
            member = message.mentions.members.first();
            if (member == undefined) {
                message.channel.send("You need to mention someone if you're trying to give someone else a class!");
                return;
            }
            name = member.user.username + " is";
            possessive = member.user.username + "'s";
        } else if (args.length == 4) {
            arr = args;
            name = "You are";
            possessive = "Your";
        } else {
            message.channel.send(rankings);
            return;
        }
        
        if (args.length == 5) arr = args.slice(1);
        for (var i = 0; i < 4; i++) arr[i] = arr[i].toUpperCase();
        var rank = new rank(arr[0], arr[1], arr[2], arr[3], message);
        if (typeof rank === "string") {
            message.channel.send(rank);
            return;
        }
        ranks.push(rank);
        registration(message, roles, rank.role);
        message.channel.send(greeting + possessive + " ranks are "
            + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
            + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n"
            + name + " now a " + rank.roleName + " of the academy!");
    } else if (command === 'checkin') {
        if (message.member.roles.find("name", "Offline Teacher")) {
            message.channel.send("You have successfully checked in.")
            message.member.addRole(teacher);
            message.member.removeRole(offline);
        } else if (message.member.roles.find("name", "Teacher")) {
            message.channel.send("You are already checked in!");
        } else {
            message.channel.send(cannotUse);
        }
        message.channel.fetchMessages({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            if (lastMessage.author.bot) {
                lastMessage.delete(timeout);
            }
        }).catch(console.error);
        message.delete(timeout);
    } else if (command === 'checkout') {
        if (message.member.roles.find("name", "Teacher")) {
            message.channel.send("You have successfully checked out.")
            message.member.addRole(offline);
            message.member.removeRole(teacher);
        } else if (message.member.roles.find("name", "Offline Teacher")) {
            message.channel.send("You are already checked out!");
        } else {
            message.channel.send(cannotUse);
        }
        message.delete(timeout);
        message.channel.fetchMessages({ limit: 1 }).then(messages => {
            let lastMessage = messages.first();
            if (lastMessage.author.bot) {
                lastMessage.delete(timeout);
            }
        }).catch(console.error);
    } else if (command === "update") {
        if (args.length != 2) message.channel.send("Incorrect usage! Correct usage is:\n"
            + "!!update [mode] [rank]\nex. !!update TC S");
        var ind = ranks.findIndex(rank => rank.id === message.member.id);
        if (ind == undefined) message.channel.send("You must register first!\n"
            + "If you have already registered, contact an admin. Data has been deleted.");
        var str = ranks[ind].set(args[0], args[1]);
        if (!isEmpty(str)) return str;
        var old = ranks[ind].roleName;
        ranks[ind].getYear();
        var add = "";
        if (old !== ranks[ind].roleName) {
            add = "\nYou are now a " + ranks[ind].roleName + "! Congratulations!";
            registration(message, roles, rank.role);
        }
        message.channel.send(greeting + "Your " + args[0] + " rank is now " + args[1]
            + "." + add);
    } else {
        message.channel.send("I do not recognize that command!");
    }
})

client.login(token);
