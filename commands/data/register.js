const Ranks = require("../../models/ranks.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://lzhang11:Ny5d6fTYra3CUT82@cluster0-shard-00-00-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-02-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-01-07nkg.mongodb.net:27017/Ranks?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin"
    , {useNewUrlParser: true});

/**
 * Adds new class (freshman, sophomore, etc.) role to user
 * Used for registration as well as graduating to a higher class
 * @param message the message sent by the user
 * @param arr the array of roles
 * @param add the role to be added
 */
registration = (member, arr, add) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase() === add.toLowerCase()) {
            member.addRole(arr[i]);
        } else {
            if (member.roles.find(role => role.name === arr[i].name)) {
                member.removeRole(arr[i]);
            }
        }
    }
}

/**
 * Checks if the rank is valid
 * @param rank the rank to be checked
 * @throws error containing message for invalid rank
 * @return str if there is an error, the associated total if no error
 */
checkRank = (rank) => {
    var total = 0;
    if (rank === "C-") total += 0.5;
    else if (rank === "C") total += 1;
    else if (rank === "C+") total += 1.5;

    else if (rank === "B-") total += 2;
    else if (rank === "B") total += 2.5;
    else if (rank === "B+") total += 3;

    else if (rank === "A-") total += 3.5;
    else if (rank === "A") total += 4;
    else if (rank === "A+") total += 4.5;

    else if (rank === "S") total += 5;

    else if (rank === "S+0") total += 5.5;
    else if (rank === "S+1") total += 5.5;
    else if (rank === "S+2") total += 5.5;
    else if (rank === "S+3") total += 6;
    else if (rank === "S+4") total += 6;
    else if (rank === "S+5") total += 6;
    else if (rank === "S+6") total += 6.5;
    else if (rank === "S+7") total += 6.5;
    else if (rank === "S+8") total += 6.5;
    else if (rank === "S+9") total += 7;

    else if (rank === "X") total += 8;
    
    else if (rank === "S+") throw "Please add a number after S+.";
    else throw "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\nex. !!register C B A S";
    return total;
}

module.exports = {
    name: "register",
    description: "Adds data to database, gives class role",
    run: async (client, message, args) => {
        var arr, member, username, possessive;
        var freshman = message.guild.roles.find(role => role.name === "Freshman");
        var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
        var junior = message.guild.roles.find(role => role.name === "Junior");
        var senior = message.guild.roles.find(role => role.name === "Senior");
        var visitor = message.guild.roles.find(role => role.name === "Visitor");
        var roles = [freshman, sophomore, junior, senior, visitor];
        var student = message.guild.roles.find(role => role.name === "Student");
        //only admins have the power to add roles to others
        if (args.length == 5 && message.member.hasPermission("ADMINISTRATOR")) {
            arr = args.slice(1);
            member = message.mentions.members.first();
            if (member == undefined) {
                message.channel.send("You need to mention someone if you're trying to give someone else a class!");
                return;
            }
            username = member.user.username + " is";
            possessive = member.user.username + "'s";
        //anyone can register themselves
        } else if (args.length == 4) {
            arr = args;
            username = "You are";
            possessive = "Your";
        } else {
            message.channel.send("Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\nex. !!register C B A S");
            return;
        }
        
        //arr is the array of ranks: [TC], [SZ], [RM], [CB]
        try {
            if (args.length == 5) arr = args.slice(1);
            for (var i = 0; i < 4; i++) arr[i] = arr[i].toUpperCase();
            var total = 0;
            for (var i = 0; i < 4; i++) total += checkRank(arr[i]);
            var name;
            if (total < 10 ) name = "Freshman";
            else if (total < 20) name = "Sophomore";
            else if (total < 30) name = "Junior";
            else name = "Senior";
        } catch (err) {
            message.channel.send(err);
            return;
        }

        Ranks.findOne({userID: message.member.user.id},
            (err, ranks) => {
                if (err) console.log(err);
                if (!ranks) {
                    const rank = new Ranks({
                        userID: message.member.user.id,
                        TC: arr[0],
                        SZ: arr[1],
                        RM: arr[2],
                        CB: arr[3],
                        role: name,
                        fc: ""
                    });
                    rank.save().catch(err => console.log(err));
                } else {
                    ranks.role = name;
                    ranks.TC = arr[0];
                    ranks.SZ = arr[1];
                    ranks.RM = arr[2];
                    ranks.CB = arr[3];
                    ranks.save().catch(err => console.log(err));
                }
                if (message.member.roles.find(role => role.name === "Teacher") || message.member.roles.find(role => role.name === "Offline Teacher")) {
                    message.channel.send(possessive + " ranks are "
                    + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
                    + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n");
                } else {
                    registration(message.member, roles, name)
                    message.channel.send(possessive + " ranks are "
                        + arr[0] + " for tower control, " + arr[1] + " for splat zones, "
                        + arr[2] + " for rainmaker, and " + arr[3] + " for clam blitz.\n"
                        + username + ` now a ${name} of the academy!`);
                    message.member.addRole(student);
                }
            });
    }
}