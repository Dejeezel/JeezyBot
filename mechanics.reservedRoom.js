var mechanicsReservedRoom = {
    run: function(room){
        if(room.memory.isReserved){
            var sources = room.find(FIND_SOURCES);
            var structures = room.find(FIND_STRUCTURES);
            var constructions = room.find(FIND_CONSTRUCTION_SITES);
            var roads = _.filter(structures, road => road.structureType == STRUCTURE_ROAD);
            var incomingRoads = _.filter(constructions, road => road.structureType == STRUCTURE_ROAD);
            var containers = _.filter(structures, container => container.structureType == STRUCTURE_CONTAINER);
            if(roads.length == 0 && incomingRoads.length == 0){
                for(var i = 0; i < sources.length; i++){
                    var exitDir = room.findExitTo(room.memory.mainRoom);
                    var exit = sources[i].pos.findClosestByRange(exitDir);
                    var roadPath = room.findPath(exit, sources[i].pos, {range: 1 , swampCost: 1});
                    console.log(roadPath.length);
                    for(var i = 0; i < roadPath.length; i++){
                    if(i == (roadPath.length - 1)){
                        room.createConstructionSite(roadPath[i].x, roadPath[i].y, STRUCTURE_CONTAINER);
                    }
                    room.createConstructionSite(roadPath[i].x, roadPath[i].y, STRUCTURE_ROAD);
                    }
                }
            }
            if(containers.length >= sources.length){
                room.memory.reservePrepared = true;
            }
            else{
                room.memory.reservePrepared = false;
            }
        }
    }
};

module.exports = mechanicsReservedRoom;