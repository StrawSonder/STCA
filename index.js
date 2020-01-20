//Initialization
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./config.json')
//timeout for checkin/checkout
const timeout = 3000;
//Adding Rank class and methods
var Rank = require('./Rank.js');
//Array for saving ranks
var ranks = [];

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
})

/**
 * When new user joins, adds Visitor role
 * Sends welcome message
 */
client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Visitor"));
    console.log(`${guildMember.user.tag} has gotten the visitor role.`);
    member.guild.channels.get('667773048732254244').send(`Welcome to the STCA, <@` + member.id + `>! If you are a student, head over to #registration !`); 
})

/**
 * When user leaves, sends leaving message
 */
client.on('guildMemberRemove', member => {
    member.guild.channels.get('667773048732254244').send(`${member.user.tag} just left the server!`); 
});

/**
 * Adds new class (freshman, sophomore, etc.) role to user
 * Used for registration as well as graduating to a higher class
 * @param message the message sent by the user
 * @param arr the array of roles
 * @param add the role to be added
 */
registration = (message, arr, add) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === add) {
            message.member.addRole(arr[i]);
        } else {
            message.member.removeRole(arr[i]);
        }
    }
}

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
 * Run when bot sees a message
 * Mostly for commands
 */
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

    /**
     * Registration command
     * used for first time students to get a class
     * Also saves the ranks to the ranks array
     */
    if (command === 'register') {
        var arr, member, name, possessive;
        //only admins have the power to add roles to others
        if (args.length == 5 && message.member.hasPermission("ADMINISTRATOR")) {
            arr = args.slice(1);
            member = message.mentions.members.first();
            if (member == undefined) {
                message.channel.send("You need to mention someone if you're trying to give someone else a class!");
                return;
            }
            name = member.user.username + " is";
            possessive = member.user.username + "'s";
        //anyone can register themselves
        } else if (args.length == 4) {
            arr = args;
            name = "You are";
            possessive = "Your";
        } else {
            message.channel.send(rankings);
            return;
        }
        
        //arr is the array of ranks: [TC], [SZ], [RM], [CB]
        if (args.length == 5) arr = args.slice(1);
        for (var i = 0; i < 4; i++) arr[i] = arr[i].toUpperCase();
        //rank variable contains info about the ranks and the user that the ranks are associated with
        var rank = new Rank(arr[0], arr[1], arr[2], arr[3], message);
        var ind = ranks.findIndex(rank => rank.message.member.id == message.member.id);
        //in general, errors are indicated by the method returning a string associated with that error
        //instead of the object or primitive it was supposed to return
        if (typeof rank === "string") {
            message.channel.send(rank);
            return;
        }
        //if valid rank and not reregistration, add it to the array
        if (ind == -1) ranks.push(rank);
        else ranks[ind] = rank;
        registration(message, roles, rank.role);
        message.channel.send(greeting + possessive + " ranks are "
            + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
            + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n"
            + name + " now a " + rank.role.name + " of the academy!");
    /**
     * checkin command allows offline teachers to check in
     * Offline Teacher is unpingable, while Teacher is pingable
     */
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
        deleteMessages(message);
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
        deleteMessages(message);
    /**
     * Updates one rank at a time for students that have already registered
     */
    } else if (command === "update") {
        if (args.length != 2) {
            message.channel.send("Incorrect usage! Correct usage is:\n"
                + "!!update [mode] [rank]\nex. !!update TC S");
            return;
        }
        //finds the rank object associated with the user
        var ind = ranks.findIndex(rank => rank.message.member.id == message.member.id);
        if (ind == -1) {
            message.channel.send("You must register first!\n"
                + "If you had previously registered and are getting this error, ping @Straw or @leonidasxlii.");
            return;
        }
        //sets the specific rank
        var str = set(args[0].toUpperCase(), args[1].toUpperCase(), ranks[ind]);
        if (typeof str === "string") {
            message.channel.send(str);
            return;
        }
        ranks[ind] = str;
        var old = ranks[ind].role;
        ranks[ind] = setYear(ranks[ind]);
        var add = "";
        //checks if user should have changed a class
        if (old != ranks[ind].role) {
            add = "\nYou are now a " + ranks[ind].role.name + "!";
            registration(message, roles, ranks[ind].role);
        }
        message.channel.send(greeting + "Your " + args[0].toUpperCase() + " rank is now " + args[1].toUpperCase() + "." + add);
    } else if (command === 'help') {
        let helpargs = args[0]
            if (args[0] == undefined) {
                message.channel.send('If you are a student and would like to register, use !!register\n If you would like to add a role, use !!role\n If you do not know how to use these commands, use !!help (command)')
            } else if (args[0] == "register") {
                message.channel.send("To register as a student, use !!register [TC] [SZ] [RM] [CB]\n"
                + "ex. !!register C+ B- A S+7")
            } else if (args[0] == "role") {
                message.channel.send("To add or remove a role, use !!role\n\nHere are the roles you can choose from:\n" +
                "LFG (If you are interested in being pinged for people looking for game)\n" +
                "NA (If you are in the NA timezone)\n" +
                "EU (If you are in the EU timezone)\n" +
                "SW (Stands for 'Stream Watcher,' for if you would like to watch peoples' streams!)")
            }
    } else if (command === 'role') {
        if (args.length != 1){
            message.channel.send("Please type the role you would like to add or remove!")
            return;
        } 
            
        var role = message.guild.roles.find(role => role.name === args[0].toUpperCase())
        if (role != undefined) {
            if (message.member.roles.find("name", role.name)) {
                message.member.removeRole(role);
                message.channel.send(`Successfully removed the role ${role.name}!`)
            } else {
                message.member.addRole(role);
                message.channel.send(`Successfully added the role ${role.name}!`)
            } 
        } else if (args[0] != "SW" && "LFG" && "NA" && "EU") {
            message.channel.send("I'm sorry! You cannot use that role!")
        } else {
            message.channel.send("That is not a role!")
        }

    } else {
        message.channel.send("I do not recognize that command!");
    }
})

client.login(token);
