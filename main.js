var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleHauler = require('role.hauler');
var roleReserver = require('role.reserver');
var roleRobberHauler = require('role.robberHauler');
var roleMeleeAttacker = require('role.meleeAttacker');
var roleRangedAttacker = require('role.rangedAttacker');
var roleGuard = require('role.guard');
var roleHealer = require('role.healer');
var roleMineralist = require('role.mineralist');
var roleControllerAttacker = require('role.controllerAttacker');
var roleInnerHauler = require('role.innerHauler');
var defensiveMechanics = require('mechanics.defensive');
var spawningMechanics = require('mechanics.spawning');
var mechanicsReservedRoom = require('mechanics.reservedRoom');
var mechanicsConstruct = require('mechanics.construct');
const profiler = require('screeps-profiler');

profiler.enable();

module.exports.loop = function () {
    profiler.wrap(function() {
        
        console.log('Bucket: ' +Game.cpu.bucket);
        for(var name in Game.rooms){
            var room = Game.rooms[name];
            var hostiles = room.find(FIND_HOSTILE_CREEPS);
            var theSpawns = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
            defensiveMechanics.run(room);
            if(room.memory.isReserved) mechanicsReservedRoom.run(room);
            if(theSpawns.length > 0){
                spawningMechanics.run(theSpawns[0]);
            }
            mechanicsConstruct.run(room);
        }
        
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }
        }
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester'){
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'builder'){
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'miner'){
                roleMiner.run(creep);
            }
            if(creep.memory.role == 'hauler'){
                roleHauler.run(creep);
            }
            if(creep.memory.role == 'reserver'){
                roleReserver.run(creep);
            }
            if(creep.memory.role == 'meleeAttacker'){
                roleMeleeAttacker.run(creep);
            }
            if(creep.memory.role == 'robberHauler'){
                roleRobberHauler.run(creep);
            }
            if(creep.memory.role == 'guard'){
                roleGuard.run(creep);
            }
            if(creep.memory.role == 'controllerAttacker'){
                roleControllerAttacker.run(creep);
            }
            if(creep.memory.role == 'healer'){
                roleHealer.run(creep);
            }
            if(creep.memory.role == 'rangedAttacker'){
                roleRangedAttacker.run(creep);
            }
            if(creep.memory.role == 'innerHauler'){
                roleInnerHauler.run(creep);
            }
            if(creep.memory.role == 'mineralist'){
               roleMineralist.run(creep);
            }
        }
    });
}