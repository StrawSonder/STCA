//Initialization
const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./config.json')
//timeout for checkin/checkout
const timeout = 10000;
//Adding Rank class and methods
var Rank = require('./Rank.js');
//Array for saving ranks
var ranks = [];

var guild, freshman, sophomore, junior, senior, visitor, teacher, offline, student;

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

// process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT')).on('uncaughtException', shutdown('uncaughtException'));
process.on('SIGINT', shutdown)

function shutdown() {
    if (guild == undefined) {
        console.log("BOT HAS FAILED");
        process.exit(0);
    }
    var channel = guild.channels.get('670054185764519952');
    var arr = [];
    for (var i = 0; i < ranks.length; i++) {
        arr.push({TC: ranks[i].TC, SZ: ranks[i].SZ, RM: ranks[i].RM, CB: ranks[i].CB, id: ranks[i].id, fc: ranks[i].fc});
    }
    channel.send(JSON.stringify(arr));
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    guild = client.guilds.get('665396787963625491');
    freshman = guild.roles.find(role => role.name === "Freshman");
    sophomore = guild.roles.find(role => role.name === "Sophomore");
    junior = guild.roles.find(role => role.name === "Junior");
    senior = guild.roles.find(role => role.name === "Senior");
    visitor = guild.roles.find(role => role.name === "Visitor");
    roles = [freshman, sophomore, junior, senior, visitor];
    teacher = guild.roles.find(role => role.name === "Teacher");
    offline = guild.roles.find(role => role.name === "Offline Teacher");
    student = guild.roles.find(role => role.name === "Student")
})

/**
 * When new user joins, adds Visitor role
 * Sends welcome message
 */
client.on('guildMemberAdd', (guildMember) => {
    guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Visitor"));
    console.log(`${guildMember.user.tag} has gotten the visitor role.`);
    guildMember.guild.channels.get('667773048732254244').send(`Welcome to the STCA, <@` + guildMember.id + `>! If you are a student, head over to #registration !`); 
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
registration = (member, arr, add) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === add) {
            member.addRole(arr[i]);
        } else {
            member.removeRole(arr[i]);
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
 * Checks the fc to see if it is valid (in the right format)
 * @param fc the friend code to be checked
 * @return the message that should be sent, depending on if the fc is valid or not
 */
checkFC = (fc) => {
    if (true) {
        return fc;
    } else {
        return "Your FC is not valid! It should be in the format ####-####-####, or similar";
    }
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
    const roleArr = ["NA", "EU", "JP", "SW", "LFG"];

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
            if (message.member.roles.find(role => role.name === "Teacher") || message.member.roles.find(role => role.name === "Offline Teacher")) {
                message.channel.send("You're a teacher, not a student! You don't need to register!");
                return;
            } 
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
        //if error is returned, return the error message and stop execution
        try {
            var rank = new Rank(arr[0], arr[1], arr[2], arr[3], message);
        } catch (err) {
            message.channel.send(err);
            return;
        }
        var ind = ranks.findIndex(ele => ele.id == message.member.id);
        //if valid rank and not reregistration, add it to the array
        if (ind == -1) ranks.push(rank);
        else ranks[ind] = rank;
        registration(message.member, roles, rank.role);
        message.channel.send(greeting + possessive + " ranks are "
            + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
            + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n"
            + name + ` now a ${rank.role.name} of the academy!`);
            message.member.addRole(student);
      
    /**
     * checkin command allows offline teachers to check in
     * Offline Teacher is unpingable, while Teacher is pingable
     */
    } else if (command === 'checkin') {
        if (message.member.roles.find(role => role.name === "Offline Teacher")) {
            message.channel.send("You have successfully checked in.")
            message.member.addRole(teacher);
            message.member.removeRole(offline);
        } else if (message.member.roles.find(role => role.name === "Teacher")) {
            message.channel.send("You are already checked in!");
        } else {
            message.channel.send(cannotUse);
        }
        deleteMessages(message);
    } else if (command === 'checkout') {
        if (message.member.roles.find(role => role.name === "Teacher")) {
            message.channel.send("You have successfully checked out.")
            message.member.addRole(offline);
            message.member.removeRole(teacher);
        } else if (message.member.roles.find(role => role.name === "Offline Teacher")) {
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
        var ind = ranks.findIndex(rank => rank.id == message.member.id);
        if (ind == -1) {
            message.channel.send("You must register first!\n"
                + "If you had previously registered and are getting this error, ping @Straw or @leonidasxlii.");
            return;
        }
        //sets the specific rank
        try {
            ranks[ind].set(args[0].toUpperCase(), args[1].toUpperCase());
        } catch (err) {
            message.channel.send(err);
            return;
        }
        var old = ranks[ind].role;
        // ranks[ind] = setYear(ranks[ind]);
        ranks[ind].setYear();
        var add = "";
        //checks if user should have changed a class
        if (old != ranks[ind].role) {
            add = "\nYou are now a " + ranks[ind].role.name + "!";
            registration(message.member, roles, ranks[ind].role);
        }
        message.channel.send(greeting + "Your " + args[0].toUpperCase() + " rank is now " + args[1].toUpperCase() + "." + add);
    } else if (command === 'help') {
        if (args[0] == undefined) {
            message.channel.send('If you are a student and would like to register, use !!register\n If you would like to add a role, use !!role\n If you do not know how to use these commands, use !!help (command)')
        } else if (args[0].toLowerCase() == "register") {
            message.channel.send("To register as a student, use !!register [TC] [SZ] [RM] [CB]\n"
            + "ex. !!register C+ B- A S+7")
        } else if (args[0].toLowerCase() == "role") {
            message.channel.send("To add or remove a role, use !!role\n\nHere are the roles you can choose from:\n" +
            "LFG (If you are interested in being pinged for people looking for game)\n" +
            "NA (If you are in the NA timezone)\n" +
            "EU (If you are in the EU timezone)\n" +
            "JP (If you are in the JP timezone)\n" +
            "SW (Stands for 'Stream Watcher,' for if you would like to watch peoples' streams!)")
        } else if (args[0].toLowerCase() == "fc") {
            message.channel.send("To add your own fc, use !!fc [your fc]\nTo get your fc, use !!fc\nTo get someone else's fc, use !!fc @[member]\n"
                + "If you need to change your fc, use !!fc @[yourself] [updated fc]");
        } else if (args[0].toLowerCase() == '<@!368889460378697730>' || args[0].toUpperCase() == '<@368889460378697730>') {
            message.channel.send("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA IM COMING TO HELP YOU HANG ON"
                + "unless im sleeping or in school or streaming or busy in other way but otherwise AAAAAAAAAAAAAAAAAAAAAAAAAAAAtusbx jt evncp");
        } else message.channel.send("I cannot help with that, I'm sorry!");
    } else if (command === 'role') {
        if (args.length != 1) {
            message.channel.send("Please type the role you would like to add or remove!")
            return;
        } 
        var role = guild.roles.find(ele => ele.name === args[0].toUpperCase())
        if (role != undefined) {
<<<<<<< HEAD
            if (roleArr.findIndex(ele => ele === args[0].toUpperCase()) == -1) {
=======
            if (role != "SW" && "LFG" && "NA" && "EU") {
>>>>>>> 3bc8dd55511b6c3fecc5edd5e6af9c37b4dc2abc
                message.channel.send("I'm sorry! You cannot use that role!");
                return;
            }
            if (message.member.roles.find(ele => ele.name === role.name)) {
                message.member.removeRole(role);
                message.channel.send(`Successfully removed the role ${role.name}!`)
            } else {
                message.member.addRole(role);
                message.channel.send(`Successfully added the role ${role.name}!`)
            }
            deleteMessages(message);
        }
        else message.channel.send("That is not a role!");
    } else if (command === 'start') {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(cannotUse);
            return;
        }
        ranks = JSON.parse(message.content.substring(8)); //doesn't parse in the command
        new Rank("C", "C", "C", "C", message); //initializes roles variable in Rank.js
        for (var i = 0; i < ranks.length; i++) {
            ranks[i] = new Rank(ranks[i].TC, ranks[i].SZ, ranks[i].RM, ranks[i].CB, ranks[i].id, ranks[i].fc);
            var member = guild.members.find(member => member.id == ranks[i].id);
            registration(member, roles, ranks[i].role);
        }
        message.channel.send("Successfully re-registered using past data!");
    } else if (command === 'fc') {
        var str;
        var ind = ranks.findIndex(rank => rank.id == message.member.id);
        if (ind == -1) {
            message.channel.send("You must register first!\n"
                + "If you had previously registered and are getting this error, ping @Straw or @leonidasxlii.");
            return;
        }
        if (args.length == 0) {
            if (ranks[ind].fc == undefined) {
                message.channel.send("You haven't set your fc yet! Set your fc with !!fc [your fc]");
                return;
            } else {
                message.channel.send("Your fc: " + ranks[ind].fc);
            }
        } else if (args.length == 1) {
            var member = message.mentions.members.first();
            if (member == undefined) {
                var str = checkFC(args[0]);
                if (!str.includes("not valid")) {
                    ranks[ind].fc = args[0];
                }
                message.channel.send(str);
                return;
            }
            if (member == message.member) {
                if (ranks[ind].fc != undefined) {
                    if (ranks[ind].ask) {
                        message.channel.send("You need to specify your new fc!");
                    } else {
                        message.channel.send("Are you sure you want to overwrite your existing fc? Enter the command again with your new fc to proceed.");
                        ranks[ind].ask = !ranks[ind].ask;
                    }
                } else {
                    message.channel.send("You need to specify an fc.");
                }
            } else {
                ind = ranks.findIndex(rank => rank.id == member.id);
                if (ind == -1) {
                    message.channel.send("That member hasn't registered yet!");
                    return;
                } else {
                    if (ranks[ind].fc == undefined) {
                        message.channel.send("That member hasn't put in their fc yet!");
                        return;
                    } else {
                        message.channel.send("fc: " + ranks[ind].fc);
                    }
                }
            }
            
        } else if (args.length == 2) {
            var member = message.mentions.members.first();
            if (member == undefined) {
                message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
                return;
            }
            if (member == message.member) {
                if (ranks[ind].fc != undefined) {
                    if (ranks[ind].ask) {
                        str = checkFC(args[1]);
                        if (!str.includes("not valid")) {
                            ranks[ind].fc = args[1];
                        }
                        message.channel.send(str);
                        return;
                    } else {
                        message.channel.send("Are you sure you want to overwrite your existing fc? Enter the command again to proceed.");
                    }
                    ranks[ind].ask = !ranks[ind].ask;
                } else {
                    str = checkFC(args[1]);
                    if (!str.includes("not valid")) {
                        ranks[ind].fc = args[1];
                    }
                    message.channel.send(str);
                    return;
                }
            } else {
                message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
                return;
            }
        } else {
            message.channel.send("Invalid use of !!fc. Use !!help fc for more information.");
        }
    } else message.channel.send("I do not recognize that command!");
});

client.login(token);
