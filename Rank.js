//https://regex101.com/r/OrmORY/1

class Rank {
    constructor(TC, SZ, RM, CB, message) {
        this.total = 0;
        this.roleName = "";
        this.role;
        var str = calcTotal(TZ, SZ, RM, CB);
        if (!isEmpty(str)) return str;
        this.TC = TC;
        this.SZ = SZ;
        this.RM = RM;
        this.CB = CB;
        this.id = message.member.id;
        getYear();
    }
    calcTotal(TC, SZ, RM, CB) {
        var arr = [TC, SZ, RM, CB];
        total = 0;
        for (var i = 0; i < 4; i++) {
            var str = checkRank(arr[i]);
            if (!isEmpty(str)) {
                return str;
            }
        }
        return "";
    }
    
    calcTotal2() {
        return calcTotal(TC, SZ, RM, CB);
    }

    checkRank(rank) {
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
        
        else if (rank === "S+") return "Please add a number after S+.";
        else return "Those are not correct rankings! Correct usage is:\n!!register [TC] [SZ] [RM] [CB]\n"
            + "ex. !!register C B A S";
        return "";
    }

    getYear() {
        var freshman = message.guild.roles.find(role => role.name === "Freshman");
        var sophomore = message.guild.roles.find(role => role.name === "Sophomore");
        var junior = message.guild.roles.find(role => role.name === "Junior");
        var senior = message.guild.roles.find(role => role.name === "Senior");
        if (total < 10 ) {
            roleName = "freshman";
            role = freshman;
        } else if (total < 20) {
            roleName = "sophomore";
            role = sophomore;
        } else if (total < 30) {
            roleName = "junior";
            role = junior;
        } else {
            roleName = "senior";
            role = senior;
        }
    }

    set(mode, rank) {
        mode = mode.toUpperCase();
        var str = checkRank(rank);
        if (!isEmpty(str)) return str;
        if (mode === "TC") TC = rank; 
        else if (mode === "SZ") SZ = rank;
        else if (mode === "RM") RM = rank;
        else if (mode === "CB") CB = rank;
        else return "Invalid mode.";
        calcTotal2();
        return "";
    }
}

module.exports = Rank;
