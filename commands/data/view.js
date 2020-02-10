const Ranks = require("../../models/ranks.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://lzhang11:Ny5d6fTYra3CUT82@cluster0-shard-00-00-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-02-07nkg.mongodb.net:27017,"
    + "cluster0-shard-00-01-07nkg.mongodb.net:27017/Ranks?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin"
    , {useNewUrlParser: true});

module.exports = {
    name: "view",
    description: "Lets user view the data currently stored with their id",
    run: async (client, message, args) => {
        Ranks.findOne({userID: message.member.user.id},
            (err, ranks) => {
                if (!ranks) {
                    message.channel.send("You must register first!");
                } else {
                    let fc = ranks.fc == "" ? "" : checkFC(ranks.fc);
                    message.channel.send("Your ranks are "
                    + ranks.TC + " for tower control, " + ranks.SZ + " for splat zones, "
                    + ranks.RM + " for rainmaker, and " + ranks.CB + " for clam blitz.\n" + fc);
                }
            });
    }
}