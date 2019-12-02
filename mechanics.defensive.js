var defensiveMechanics = {
    run: function(room){
        const rampartsMinHp = 10000;
        const containerMinHp = 6000;
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        var damagedFriendlies = _.filter(room.find(FIND_MY_CREEPS), creep => creep.hits < creep.hitsMax);
        var structs = room.find(FIND_STRUCTURES);
        var towers = _.filter(structs, struct => struct.structureType == STRUCTURE_TOWER);
        towers = _.filter(towers, tower => tower.energy > 10);
        var ramparts = _.filter(structs, struct => struct.structureType == STRUCTURE_RAMPART);
        ramparts = _.filter(ramparts, rampart => rampart.hits < rampartsMinHp);
        var containers = _.filter(structs, struct => struct.structureType == STRUCTURE_CONTAINER);
        containers = _.filter(containers, container => container.hits < containerMinHp);
        var roads = _.filter(structs, struct => struct.structureType == STRUCTURE_ROAD);
        roads = _.filter(roads, road => road.hits <= (road.hitsMax - 600));
        if(towers.length == 0 && hostiles.length > 0){
            if(room.controller != undefined && room.controller.level > 0){
            room.controller.activateSafeMode();
            }
        }
        if(hostiles.length > 0){
            for(var i = 0; i<towers.length; i++){
                towers[i].attack(hostiles[0]);
            }
        }
        else if(damagedFriendlies.length > 0){
            for(var i = 0; i<towers.length; i++){
                towers[i].heal(damagedFriendlies[0]);
            }
        }
        else if(containers.length > 0){
            for(var i = 0; i<towers.length; i++){
                towers[i].repair(containers[0]);
            }
        }
        else if(roads.length > 0){
            for(var i = 0; i<towers.length; i++){
                towers[i].repair(roads[0]);
                if(roads[0].hits == roads[0].hitsMax) break;
            }
        }
        else if(ramparts.length > 0){
            for(var i = 0; i<towers.length; i++){
                towers[i].repair(ramparts[0]);
            }
        }
    }
};

module.exports = defensiveMechanics;