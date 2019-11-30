var mechanicsRemote = require('mechanics.remote');

var roleBuilder = {
    run: function(creep){
        if(creep.memory.remote == true && creep.memory.remoteRoom != creep.room.name){
                mechanicsRemote.goToRoom(creep, creep.memory.remoteRoom);
            }
        else{
            var constructions = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            var repaireable = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax})
            var roads = _.filter(repaireable, road => road.structureType == STRUCTURE_ROAD && road.hits < (road.hitsMax - 700));
            var walls = _.filter(repaireable, wall => wall.structureType == STRUCTURE_WALL || wall.structureType == STRUCTURE_RAMPART);
            var containers = _.filter(repaireable, container => container.structureType == STRUCTURE_CONTAINER);
            var miners = _.filter(Game.creeps, miner => miner.memory.role == 'miner' && miner.room.name == creep.room.name);
            var wallsAvg = (_.sum(walls, wall => wall.hits) / walls.length);
            walls = _.filter(walls, wall => wall.hits < wallsAvg);
            if(creep.carry.energy < creep.carryCapacity && creep.memory.upgrading == false && miners.length > 0){
                var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    if(target != null && target.amount > (creep.getActiveBodyparts(CARRY)*50)) {
                        creep.pickup(target);
                        creep.moveTo(target);
                    }
                    else{
                        var containers = _.filter(creep.room.find(FIND_STRUCTURES), struct => (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && struct.store[RESOURCE_ENERGY] > 0);
                        var container = creep.pos.findClosestByRange(containers);
                        if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(container);
                        }
                    }
            }
            else if(creep.carry.energy < creep.carryCapacity && creep.memory.upgrading == false){
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                    creep.moveTo(source);
                }
            }
            else{
                creep.memory.upgrading = true;
                if(creep.carry.energy == 0){
                    creep.memory.upgrading = false;
                }
                var struct;
                let extensionsToConstruct = _.filter(constructions, struc => struc.structureType == STRUCTURE_EXTENSION)
                let spawnToConstruct = _.filter(constructions, struc => struc.structureType == STRUCTURE_SPAWN)
                if(extensionsToConstruct.length > 0){
                    constructions = extensionsToConstruct;
                }
                if(spawnToConstruct.length > 0){
                    constructions = spawnToConstruct;
                }
                if(constructions.length > 0) struct = creep.pos.findClosestByRange(constructions);
                else if(containers.length > 0) struct = creep.pos.findClosestByRange(containers);
                else if(roads.length > 0) struct = creep.pos.findClosestByRange(roads);
                else if(walls.length > 0) struct = creep.pos.findClosestByRange(walls);
                if(creep.build(struct) == ERR_NOT_IN_RANGE){
                if(constructions[0].structureType == STRUCTURE_CONTAINER){
                    //remote mining
                }
                creep.moveTo(struct);
                }
                else if(creep.build(struct) == ERR_INVALID_TARGET){
                if(creep.repair(struct) == ERR_NOT_IN_RANGE){
                    creep.moveTo(struct);
                }
                }
            }
        }
    }
}

module.exports = roleBuilder;