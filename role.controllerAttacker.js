var mechanicsRemote = require('mechanics.remote');

var controllerAttacker = {
    run: function(creep){
        if(creep.room.name != creep.memory.remoteRoom){
            mechanicsRemote.goToRoom(creep, creep.memory.remoteRoom);
        }
        else{
            if(creep.room.controller.level == 0 && creep.room.controller.owner != undefined){
                creep.reserveController(creep.room.controller);
            }
            if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
            else if(creep.attackController(creep.room.controller) == ERR_INVALID_TARGET){
                creep.claimController(creep.room.controller);
                creep.room.memory.autoConstruct = true;
            }
        }
    }
};

module.exports = controllerAttacker;