var mechanicsRemote = require('mechanics.remote');

var roleGuard = {
    run: function(creep){
        if(creep.getActiveBodyparts(TOUGH) == 0){
            mechanicsRemote.goToRoom(creep, creep.memory.homeRoom);
            creep.memory.repairing = true
            if(creep.memory.homeRoom == creep.room.name){
                creep.moveTo(creep.room.controller);
            }
        }
        else{
            if(creep.hits == creep.hitsMax){
                creep.memory.repairing = false;
            }
            if(creep.room.name != creep.memory.guardRoom && creep.memory.repairing != true){
                mechanicsRemote.goToRoom(creep, creep.memory.guardRoom);
            }
            else{
                let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                if(hostiles.length > 0){
                    let victim = creep.pos.findClosestByRange(hostiles);
                    if(creep.attack(victim) == ERR_NOT_IN_RANGE){
                            creep.moveTo(victim);
                            if(creep.hits < creep.hitsMax){
                                creep.heal(creep);
                            }
                    }
                    else{
                        creep.attack(victim);
                        creep.say('FOR KING DREIKEN!');
                    }
                }
                else{
                    creep.moveTo(creep.room.controller, {range : 3});
                }
                let allies = creep.room.find(FIND_MY_CREEPS);
                let damaged = _.filter(allies, ally => ally.hits < ally.hitsMax);
                if(allies.length > 0 && hostiles.length == 0){
                    let ally = creep.pos.findClosestByPath(damaged);
                    if(creep.heal(ally) == ERR_NOT_IN_RANGE){
                        creep.moveTo(ally);
                    }
                    else{
                        creep.moveTo(ally);
                    }
                }
            }
        }
    }
};

module.exports = roleGuard;