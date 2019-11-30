var mechanicsRemote = require('mechanics.remote');

var roleHarvester = {
    run: function(creep){
         if(creep.memory.remote == true && creep.memory.remoteRoom != creep.room.name){
                mechanicsRemote.goToRoom(creep, creep.memory.remoteRoom);
        }
        else{
            var structs = creep.room.find(FIND_MY_STRUCTURES);
            structs = _.filter(structs, (stru) => (stru.structureType == STRUCTURE_EXTENSION) || stru.structureType == STRUCTURE_SPAWN  || stru.structureType == STRUCTURE_TOWER);
            var miners = _.filter(Game.creeps, miner => miner.memory.role == 'miner' && miner.memory.homeRoom == creep.memory.homeRoom);
            if(creep.memory.remote == true){
                miners = [];
            }
            var energyHaulers = _.filter(Game.creeps, hauler => hauler.memory.role == 'energyHauler' && creep.memory.homeRoom == hauler.memory.homeRoom);
            if(creep.carry.energy < creep.carryCapacity && creep.memory.upgrading == false && miners.length > 1){
                var containers = _.filter(creep.room.find(FIND_STRUCTURES), struct => (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && struct.store[RESOURCE_ENERGY] >= (creep.getActiveBodyparts(CARRY)*50));
                containers.sort((close, far) => creep.pos.getRangeTo(close) - creep.pos.getRangeTo(far));
                if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containers[0]);
                }
            }
            else if(creep.carry.energy < creep.carryCapacity && creep.memory.upgrading == false){
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                let source = creep.pos.findClosestByPath(sources);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
            }
            else{
                if(creep.carry.energy == 0){
                    creep.memory.upgrading = false;
                    creep.say('hsv');
                }
                else{
                creep.memory.upgrading = true;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                    }
                else{
                    creep.signController(creep.room.controller, 'Death to non coders!');
                }
                }
                var energyHaulers = _.filter(Game.creeps, creep => creep.memory.role == 'miner');
                if(creep.memory.isAlwaysUpgrading == undefined){
                    let innerHaulers = _.filter(Game.creeps, hauler => creep.memory.role == 'innerHauler' && hauler.room.name == creep.memory.homeRoom);
                    if(innerHaulers.length == 0){
                        for(var name in structs){
                            var struct = structs[name];
                            if(!(innerHaulers.length > 0)){
                                    if(struct.energy < struct.energyCapacity){
                                       creep.moveTo(struct);
                                       creep.transfer(struct, RESOURCE_ENERGY);
                                       creep.say('tnf');
                                    }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;