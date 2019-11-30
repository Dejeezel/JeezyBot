var innerHauler = {
    run: function(creep){
        const sources = creep.room.find(FIND_SOURCES);
        const myStorage = creep.room.storage;
        if(creep.memory.miningContainers == undefined){
            var miningContainers = _.filter(creep.room.find(FIND_STRUCTURES), struct => sources.some(source => source.pos.isNearTo(struct)) && struct.structureType == STRUCTURE_CONTAINER);
            creep.memory.miningContainers = _.map(miningContainers, mContainer => mContainer.id);
        }
        var miningContainers = creep.memory.miningContainers
        var innerContainers = _.filter(creep.room.find(FIND_STRUCTURES), struct => (struct.structureType == STRUCTURE_CONTAINER) && !miningContainers.some(mContainer => struct.id == mContainer));
        
        if(_.sum(creep.carry) == creep.carryCapacity){
            creep.memory.transfering = true;
        }
        else if(_.sum(creep.carry) == 0){
            creep.memory.transfering = false;
        }
        if(creep.memory.transfering == false){
            if(creep.withdraw(myStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(myStorage);
            }
        }
        else{
            let energyThings = _.filter(creep.room.find(FIND_STRUCTURES), energyStruct => energyStruct.structureType == STRUCTURE_EXTENSION || energyStruct.structureType == STRUCTURE_SPAWN || energyStruct.structureType == STRUCTURE_TOWER);
            energyThings = _.filter(energyThings, energyStruct => energyStruct.energy < energyStruct.energyCapacity);
            if(energyThings.length > 0 && creep.carry.energy > 0){
                var energyProx = creep.pos.findClosestByRange(energyThings);
                if(creep.transfer(energyProx, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(energyProx);
                }
            }
            else{
                innerContainers = _.filter(innerContainers, x => _.sum(x.store) < x.storeCapacity);
                let closestInnerContainer = creep.pos.findClosestByRange(innerContainers);
                if(creep.transfer(closestInnerContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(closestInnerContainer);
                }
            }
        }
    }
};

module.exports = innerHauler;