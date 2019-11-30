var roleMineralist = {
    run: function(creep){
        var storageToHaul;
        var mineral = creep.room.find(FIND_MINERALS);
        var resource = mineral[0].mineralType;
        if(_.sum(creep.room.terminal.store) != creep.room.terminal.storeCapacity) storageToHaul = creep.room.terminal;
        else creep.room.storage;
        
        if((_.sum(creep.carry)) < creep.carryCapacity){
            if(creep.harvest(mineral[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(mineral[0]);
            }
        }
        else {
            if(creep.transfer(storageToHaul, resource) == ERR_NOT_IN_RANGE){
                creep.moveTo(mineral[0]);
            }
        }
    }
};

module.exports = roleMineralist;