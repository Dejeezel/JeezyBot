var mechanicsRemote = require('mechanics.remote');

var robberHauler = {
    run: function(creep){
        if(creep.memory.leechRoom != undefined){
            if(creep.carry.energy == 0 && creep.room.name != creep.memory.leechRoom){
                mechanicsRemote.goToRoom(creep, creep.memory.leechRoom);
                creep.say('robbing');
            }
            else if(creep.carry.energy == 0 && creep.room.name == creep.memory.leechRoom){
                let storage = creep.room.storage;
                if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(storage);
                    creep.say('THX4ENERGY');
                }
            }
            else if(creep.carry.energy != 0 && creep.room.name != creep.memory.homeRoom){
                mechanicsRemote.goToRoom(creep, creep.memory.homeRoom);
                creep.say('illbeback');
            }
            else{
                let homeStorage = creep.room.storage;
                if(creep.transfer(homeStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(homeStorage);
                    creep.say('hehestoring');
                }
            }
        }
    }
};

module.exports = robberHauler;