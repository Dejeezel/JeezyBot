 var mechanicsRemote = require('mechanics.remote');

var meleeAttacker = {
    run: function(creep){
        var towers = creep.room.find(FIND_HOSTILE_STRUCTURES);
        towers = _.filter(towers, tower => tower.structureType == STRUCTURE_TOWER);
        creep.say('go respawn', {public: true});
        if(creep.memory.isInvader && creep.memory.attackRoom != creep.room.name){
            mechanicsRemote.goToRoom(creep, creep.memory.attackRoom);
        }
        else{
            if(creep.memory.squadLeader){
                let mates = _.filter(Game.creeps, mate => mate.memory.squadNumber == creep.memory.squadNumber);
            }
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if(towers.length > 0){
                let ramparts = creep.room.find(FIND_HOSTILE_STRUCTURES);
                ramparts = _.filter(ramparts, rampart => rampart.structureType == STRUCTURE_RAMPART);
                let victim = creep.pos.findClosestByPath(ramparts);
                if(creep.attack(victim) == ERR_NOT_IN_RANGE){
                      creep.moveTo(victim);
                }
            }
            if(hostiles.length > 0){
                if(creep.memory.keepMinersAlive == true){
                    hostiles = _.filter(hostiles => miner => miner.getActiveBodyparts(CARRY) != 1);
                }
                let victim = creep.pos.findClosestByPath(hostiles);
                    if(creep.attack(victim) == ERR_NOT_IN_RANGE){
                      creep.moveTo(victim);
                    }
                    else if(creep.hits < creep.hitsMax){
                        creep.heal(creep);
                    }
                }
            else{
                let enemyStructs = creep.room.find(FIND_HOSTILE_STRUCTURES);
                let enemyConstructions = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                let enemySpawns = _.filter(enemyStructs, x => x.structureType == STRUCTURE_SPAWN);
                console.log(enemySpawns.length);
                if(enemySpawns.length == 0) enemySpawns = _.filter(enemyStructs, x => x.structureType == STRUCTURE_EXTENSION);
                if(enemySpawns.length == 0) enemySpawns = _.filter(enemyStructs, x => x.structureType == STRUCTURE_CONTAINER);
                if(creep.attack(enemySpawns[0]) == ERR_NOT_IN_RANGE){
                      creep.moveTo(enemySpawns[0]);
                }
                if(enemyStructs.length == 0){
                    if(creep.room.controller == undefined || creep.room.controller.owner == undefined || creep.room.controller.owner.username != creep.owner.username){
                    let structs = creep.room.find(FIND_STRUCTURES);
                    structs = _.filter(structs, x => x.structureType != STRUCTURE_WALL);
                    structs = _.filter(structs, x => x.structureType != STRUCTURE_CONTROLLER);
                    let victim = creep.pos.findClosestByRange(structs);
                    if(creep.attack(victim) == ERR_NOT_IN_RANGE){
                        creep.moveTo(victim);
                    }
                    }
                }
            }
            if(creep.hits < (creep.hitsMax / 3)){
                mechanicsRemote.goToRoom(creep, creep.memory.homeRoom);
            }
        }
    }
};

module.exports = meleeAttacker;