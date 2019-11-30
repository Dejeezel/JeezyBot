var mechanicsRemote = require('mechanics.remote');

var roleMiner = {
    run: function(creep){
        var miners = _.filter(Game.creeps, (miner) => miner.memory.role == 'miner' && miner.id != creep.id);
        var sources = creep.room.find(FIND_SOURCES);
        const miningMax = 42;
        if(creep.memory.remote == true && creep.memory.homeRoom == creep.room.name){
                mechanicsRemote.goToRoom(creep, creep.memory.remoteRoom);
            }
        else{
            if(creep.carry.energy < miningMax && creep.memory.upgrading == false && creep.memory.miningPoint == undefined){
                var i;
                for(i = 0; i < sources.length; i++){
                    if(!(miners.some(miner => miner.memory.miningPoint == sources[i].id))){
                        if(creep.harvest(sources[i]) == ERR_NOT_IN_RANGE){
                            creep.moveTo(sources[i]);
                        }
                        else(creep.memory.miningPoint = sources[i].id);
                    }
                }
            }
            else if(creep.carry.energy < miningMax && creep.memory.upgrading == false){
                const source = Game.getObjectById(creep.memory.miningPoint);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
                else if(creep.memory.isOnTheContainer){
                    creep.drop(RESOURCE_ENERGY);
                }
            }
            else{
                creep.drop(RESOURCE_ENERGY);
                creep.memory.upgrading = false;
            }
            /*else if (creep.memory.miningPoint != undefined){
                creep.memory.upgrading = true;
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure) {return structure.structureType == STRUCTURE_CONTAINER} } );
                if(container != null && !(creep.pos.isEqualTo(container.pos))){
                    creep.moveTo(container);
                }
                else{
                    creep.moveTo(container);
                    if(container.hits < container.hitsMax){
                        creep.repair(container);
                    }
                    else{
                      creep.drop(RESOURCE_ENERGY);
                    }
                    if(creep.carry.energy == 0){
                        creep.memory.upgrading = false;
                    }
                    creep.memory.isOnTheContainer = true;
                }
              
            }*/
        }
    }
};

module.exports = roleMiner;