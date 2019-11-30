var mechanicsRemote = require('mechanics.remote');

var roleHauler = {
    run: function(creep){
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.memory.miningContainers == undefined && creep.memory.remote != true){
                    var miningContainers = _.filter(creep.room.find(FIND_STRUCTURES), struct => sources.some(source => source.pos.isNearTo(struct)) && struct.structureType == STRUCTURE_CONTAINER);
                    creep.memory.miningContainers = _.map(miningContainers, mContainer => mContainer.id);
        }
        if((creep.memory.miningContainers == undefined && creep.memory.remoteRoom == creep.memory.room && creep.memory.remote) || !(creep.memory.remote) || creep.memory.miningContainers != undefined){
        var miningContainers = creep.memory.miningContainers;
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), struct => (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && !(miningContainers.some(mContainer => struct.id == mContainer)));
        }
        if(_.sum(creep.carry) == 0){
            if(creep.memory.remote == true && creep.memory.homeRoom == creep.room.name){
                mechanicsRemote.goToRoom(creep, creep.memory.remoteRoom);
            }
            else{
                if(creep.memory.miningContainers == undefined){
                    var miningContainers = _.filter(creep.room.find(FIND_STRUCTURES), struct => sources.some(source => source.pos.isNearTo(struct)) && struct.structureType == STRUCTURE_CONTAINER);
                    creep.memory.miningContainers = _.map(miningContainers, mContainer => mContainer.id);
                }
                var miningContainers = creep.memory.miningContainers;
                var containers = _.filter(creep.room.find(FIND_STRUCTURES), struct => (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE) && !(miningContainers.some(mContainer => struct.id == mContainer)));
                if(creep.memory.haulContainer == undefined){
                    var haulers = _.filter(Game.creeps, creep => creep.memory.role == 'hauler');
                    for(var i = 0; i<miningContainers.length ; i++){
                        var containerId = miningContainers[i];
                        if(!(haulers.some(hauler => hauler.memory.haulContainer == containerId))){
                            creep.memory.haulContainer = containerId
                        }
                    }
                }
                else{
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    if(target != null && target.amount > (creep.getActiveBodyparts(CARRY)*50)) {
                        creep.pickup(target);
                        creep.moveTo(target);
                    }
                    else{
                        var miningToHaul = Game.getObjectById(creep.memory.haulContainer);
                        if(miningToHaul != undefined && _.sum(miningToHaul.store) >= (creep.getActiveBodyparts(CARRY)*50)){
                            if(creep.withdraw(miningToHaul, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(miningToHaul, {reusePath: 50, range: 1});
                            }
                        }
                        else if (!(creep.pos.isNearTo(miningToHaul))){
                            creep.moveTo(miningToHaul);
                        }
                    }
                }
            }
        }
        else{
            if(creep.memory.remote == true && creep.memory.homeRoom != creep.room.name){
                mechanicsRemote.goToRoom(creep, creep.memory.homeRoom);
            }
            else{
                containers = _.filter(containers, container => (_.sum(container.store) + _.sum(creep.carry)) <= container.storeCapacity);
                var containerToFull = creep.pos.findClosestByRange(containers);
                if(creep.transfer(containerToFull, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containerToFull);
                    }
                }
        }
    }
};

module.exports = roleHauler;