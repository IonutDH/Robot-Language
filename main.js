"use strict";

var fs = require('fs');

var X = 0;
var Y = 0;
var R = 90;
var noRepLine;
var nrRep;
var isRep0 = false;
var inRep = false;
var end;

try {
    var file = fs.readFileSync(process.argv[2]).toString();
    var p = file.split('\n');
    var cmd2, orig;
    var cmd = [];
    var linenum = [];
    var a = 0;
    for(var i = 0; i < p.length; i++) {
        p[i] = p[i].trim();
        if(p[i].length == 0)
            continue;
        if((p[i])[0] == '#')
            continue;
        for(var j = 0; j < p[i].length; j++) {
            if((p[i])[j] == ' ' || (p[i])[j] == ',') {
                break;
            }
        }

        var cmdloc = [];
        if(j == p[i].length) {
            cmdloc.push(p[i]);
        } else {
            cmdloc.push(p[i].substring(0, j));
            p[i] = p[i].substring(j + 1);
            var pause = p[i].split(',');
            for(var k = 0; k < pause.length; k++) {
                pause[k] = pause[k].trim();
            }
            for(var k = 0; k < pause.length; k++) {
                cmdloc.push(pause[k]);
            }
        }
        cmd.push(cmdloc);
        linenum.push(i+1);
    }
        a = 0;
        while(a < linenum.length) {    
        var list = (cmd[a])[0];
        orig = list;
        cmd2 = orig.toUpperCase();
        switch(cmd2) {
            case "FORWARD":
                forward(cmd[a], a);
                break;
            case "BACKWARD":
                backward(cmd[a], a);
                break;
            case "TURN":
                turn(cmd[a], a);
                break;
            case "JUMP":
                jump(cmd[a], a);
                break;
            case "REPEAT":
                repeat(cmd[a], a);
                break;
            case "END":
                endf(cmd[a], a);
                break;
            default:
                console.log("ERROR LINE " + linenum[a] + ": Unknown command " + cmd2);
                break;
        }
        a++;
    }
}
catch(error) {
    console.log(error);
}

if(end == false){
    console.log("ERROR LINE " + p.length + ": You have 1 REPEAT without END");
}



function ok(){
    console.log("OK " + X + ", " + Y + ", " + R);
}



function forward(cmd, possition) {
    if(cmd.length != 2) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 1 parameters, you wrote " + cmd.length);
        return;
    }

    if(isNaN(cmd[1]) == true) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a number, you wrote " + cmd[1]);    
        return;
    }

    if(isRep0 == true){
        return;
    }
    
    var alpha = R*Math.PI/180;
    X += cmd[1]*Math.cos(alpha);
    Y += cmd[1]*Math.sin(alpha);
    X = Math.round(X);
    Y = Math.round(Y);
    ok();
}


function backward(cmd, possition) {
    if(cmd.length != 2) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 1 parameters, you wrote " + cmd.length);
        return;
    }

    if(isNaN(cmd[1]) == true) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a number, you wrote " + cmd[1]);    
        return;
    }

    if(isRep0 == true){
        return;
    }
    
    var alpha = R*Math.PI/180;
    X -= cmd[1]*Math.cos(alpha);
    Y -= cmd[1]*Math.sin(alpha);
    X = Math.round(X);
    Y = Math.round(Y);
    ok();
}


function turn(cmd, possition) {
    if(cmd.length != 3) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 2 parameters, you wrote " + (cmd.length-1));
        return;
    }

    if(cmd[1] != "left" && cmd[1] != "right") {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a left/right, you wrote " + cmd[1]);
        return;
    }

    if(isNaN(cmd[2]) == true) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 2 requires a number, you wrote " + cmd[2]);    
        return;
    }

    if(isRep0 == true){
        return;
    }

    if(cmd[1] == "left") {
        R += parseInt(cmd[2]);
    } else {
        R -= parseInt(cmd[2]);
    }

    while(R < 0) {
        R += 360;
    }
    R %= 360;
    ok();
}



function jump(cmd, possition) {
    if(cmd.length != 3) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 2 parameters, you wrote " + (cmd.length-1));
        return;
    }

    if(isNaN(parseInt(cmd[1])) == true && cmd[1] != '~') {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a number or ~, you wrote " + cmd[1]);    
        return;
    }

    if(isNaN(parseInt(cmd[2])) == true && cmd[2] != '~') {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 2 requires a number or ~, you wrote " + cmd[2]);    
        return;
    }

    if(isRep0 == true){
        return;
    }

    if(cmd[2] == '~') {
        X = cmd[1];
        ok();
        return;
    }

    if(cmd[1] == '~') {
        Y = cmd[2];
        ok();
        return;
    }

    X = cmd[1];
    Y = cmd[2];
    ok();
}



function repeat(cmd, possition) {
    noRepLine = linenum[possition];
    end = false;
    if(cmd.length != 2) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 1 parameters, you wrote " + (cmd.length-1));
        return;
    }

    if(isNaN(cmd[1]) == true) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a number, you wrote " + cmd[1]);    
        return;
    }

    if(parseInt(cmd[1]) < 0){
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " parameter 1 requires a positive number, you wrote " + cmd[1]);    
        return;
    }

    if(parseInt(cmd[1]) == 0){
        isRep0 = true;
        return;
    }

    if(inRep == false){
        inRep = true;
        ok();
        noRepLine = linenum[possition];
        nrRep = cmd[1];
        nrRep --;
        return;
    }
    return;
}

function endf(cmd, possition){
    end = true;
    if(cmd.length != 1) {
        console.log("ERROR LINE " + linenum[possition] + ": " + orig + " has 0 parameters, you wrote " + (cmd.length-1));
        return;
    }

    if(isRep0 == true){
        return;
    }

    if(inRep == false){
        console.log("ERROR LINE " + linenum[possition] + ": END and no REPEAT");
        return;
    }else
    if(nrRep != 0){
        ok();
        nrRep --;
        a = noRepLine - 2;
        return;
    }else{
        ok();
        inRep = false;
        return;
    }
    
}
