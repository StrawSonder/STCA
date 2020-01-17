//https://regex101.com/r/OrmORY/1

class Rank {
    constructor(TC, SZ, RM, CB, id) {
        this.total = 0;
        var str = calcTotal(TZ, SZ, RM, CB);
        if (!isEmpty(str)) {
            return str;
        }
        this.TC = TC;
        this.SZ = SZ;
        this.RM = RM;
        this.CB = CB;
        this.id = id;
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

    set(mode, rank) {
        mode = mode.toUpperCase();
        var str = checkRank(rank);
        if (!isEmpty(str)) return str;
        if (mode === "TC") TC = rank; 
        else if (mode === "SZ") SZ = rank;
        else if (mode === "RM") RM = rank;
        else if (mode === "CB") CB = rank;
        else return "Invalid mode.";
        return "";
    }

    /*setTC(TC) {
        var str = checkRank(TC);
        this.TC = TC;
        calcTotal();
    }

    setTC(SZ) {
        this.SZ = SZ;
        calcTotal();
    }

    setRM(RM) {
        this.RM = RM;
        calcTotal();
    }

    setCB(CB) {
        this.CB = CB;
        calcTotal();
    }
    */

    getTC(TC) {
        return TC;
    }

    getTC(SZ) {
        return TC;
    }

    getRM(RM) {
        return TC;
    }

    getCB(CB) {
        return TC;
    }
}