var mechanicsRemote = {
    goToRoom: function(creep, roomName){
        const exitDir = creep.room.findExitTo(roomName);
        const exit = creep.pos.findClosestByPath(exitDir);
        creep.moveTo(exit);
    }
};

module.exports = mechanicsRemote;