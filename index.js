
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./config.json')


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
    console.log(`${guildMember.user.tag} has gotten the visitor role.`)
})

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
        var total = 0;
        var freshman = message.guild.roles.find(role => role.name === "Freshman");
        var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
        var junior = message.guild.roles.find(role => role.name === "Junior");
        var senior = message.guild.roles.find(role => role.name === "Senior");
        var visitor = message.guild.roles.find(role => role.name === "Visitor");
        var roles = [freshman, sophomore, junior, senior, visitor];
        if (args.length == 5) arr = args.slice(1);
        for (var i = 0; i < 4; i++) {
            arr[i] = arr[i].toUpperCase();
        }
        for (var i = 0; i < 4; i++) {
            if (arr[i] === "C-") total += 0.5;
            else if (arr[i] === "C") total += 1;
            else if (arr[i] === "C+") total += 1.5;

            else if (arr[i] === "B-") total += 2;
            else if (arr[i] === "B") total += 2.5;
            else if (arr[i] === "B+") total += 3;

            else if (arr[i] === "A-") total += 3.5;
            else if (arr[i] === "A") total += 4;
            else if (arr[i] === "A+") total += 4.5;

            else if (arr[i] === "S") total += 5;

            else if (arr[i] === "S+0") total += 5.5;
            else if (arr[i] === "S+1") total += 5.5;
            else if (arr[i] === "S+2") total += 5.5;
            else if (arr[i] === "S+3") total += 6;
            else if (arr[i] === "S+4") total += 6;
            else if (arr[i] === "S+5") total += 6;
            else if (arr[i] === "S+6") total += 6.5;
            else if (arr[i] === "S+7") total += 6.5;
            else if (arr[i] === "S+8") total += 6.5;
            else if (arr[i] === "S+9") total += 7;

            else if (arr[i] === "X") total += 8;
            
            else if (arr[i] === "S+") {
                message.channel.send("Please add a number after S+.")
                return;
            }
            else {
                message.channel.send(rankings);
                return;
            }
        }
        
        if (total < 10 ) {
            roleName = "freshman";
            registration(message, roles, freshman);
        } else if (total < 20) {
            roleName = "sophomore";
            registration(message, roles, sophomore);
        } else if (total < 30) {
            roleName = "junior";
            registration(message, roles, junior);
        } else {
            roleName = "senior";
            registration(message, roles, senior)
        }
        message.channel.send(greeting + possessive + " ranks are "
            + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
            + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n"
            + name + " now a " + roleName + " of the academy!");
    } else if (command === 'checkin') {
        var teacher = message.guild.roles.find(role => role.name === "Teacher");
        var offline = message.guild.roles.find(role => role.name === "Offline Teacher");
        if (message.member.roles.find("name", "Offline Teacher")) {
            message.channel.send("You have successfully checked in.")
            message.member.addRole(teacher);
            message.member.removeRole(offline);
        } else if (message.member.roles.find("name", "Teacher")) {
            message.channel.send("You are already checked in!");
        } else {
            message.channel.send(cannotUse);
        }
    } else if (command === 'checkout') {
        var teacher = message.guild.roles.find(role => role.name === "Teacher");
        var offline = message.guild.roles.find(role => role.name === "Offline Teacher");
        if (message.member.roles.find("name", "Teacher")) {
            message.channel.send("You have successfully checked out.")
            message.member.addRole(offline);
            message.member.removeRole(teacher);
        } else if (message.member.roles.find("name", "Offline Teacher")) {
            message.channel.send("You are already checked out!");
        } else {
            message.channel.send(cannotUse);
        }
    } else {
        message.channel.send("I do not recognize that command!")
    }
})

client.login(token);
