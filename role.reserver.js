var roleReserver = {
    run: function(creep){
        if(creep.memory.gaveInfo == false){
            creep.memory.gaveInfo = true;
            if(creep.room.memory.reservedRooms == undefined) creep.room.memory.reservedRooms = [];
            if(!(creep.room.memory.reservedRooms.includes(creep.memory.reserveRoom))){
                creep.room.memory.reservedRooms += creep.memory.reserveRoom;
            }
        }
        if(creep.room.name == creep.memory.homeRoom && creep.memory.keeperRoom != undefined){
            creep.room.memory.keeperRoom = creep.memory.keeperRoom;
            creep.memory.keeperRoom = undefined;
            creep.memory.reserveRoom = undefined;
            creep.moveTo(creep.room.controller);
        }
        if(creep.room.name == creep.memory.homeRoom && creep.memory.otherRoom != undefined){
            creep.room.memory.otherRoom = creep.memory.otherRoom;
            creep.memory.otherRoom = undefined;
            creep.memory.reserveRoom = undefined;
            creep.moveTo(creep.room.controller);
        }
        if(creep.room.name == creep.memory.homeRoom && creep.memory.reserveRoom == undefined){
            let reservers = _.filter(Game.creeps, creep => creep.memory.role == 'reserver');
            let reserversRooms = _.map(reservers, reserver => reserver.memory.reserveRoom);
            var exits = _.map(Game.map.describeExits(creep.memory.homeRoom), exit => exit);
            exits = _.filter(exits, roomName => creep.room.memory.keeperRoom != roomName && creep.room.memory.otherRoom != roomName);
            for(var i = 0; i < reserversRooms.length ; i++){
                exits = _.filter(exits, roomName => roomName != reserversRooms[i]);
            }
            var exitDir = Game.map.findExit(creep.room, exits[0]);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
        else if(creep.room.name != creep.memory.homeRoom && creep.memory.reserveRoom == undefined){
            if(creep.room.controller != undefined && (creep.room.memory.mainRoom == undefined || creep.room.memory.mainRoom == creep.memory.homeRoom)){
                creep.memory.reserveRoom = creep.room.name;
            }
            else if(creep.room.memory.mainRoom != undefined && creep.room.memory.mainRoom != creep.memory.homeRoom){
                creep.memory.otherRoom = creep.room.name;
                var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
            else{
                creep.memory.keeperRoom = creep.room.name;
                var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
                var exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit);
            }
        }
        if(creep.room.name != creep.memory.homeRoom && creep.memory.reserveRoom != undefined && creep.memory.gaveInfo == undefined){
            var exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            creep.memory.gaveInfo = false;
        }
        if(creep.room.name != creep.memory.homeRoom && creep.memory.reserveRoom != undefined && creep.memory.gaveInfo == true){
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
            else{
                creep.signController(creep.room.controller, "VIVAT REX DREIKEN");
                creep.room.memory.isReserved = true;
                creep.room.memory.mainRoom = creep.memory.homeRoom;
            }
        }
    }
};

module.exports = roleReserver;