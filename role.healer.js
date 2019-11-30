var mechanicsRemote = require('mechanics.remote');

var roleHealer = {
  run: function(creep){
      if(creep.hits < creep.hitsMax){
          creep.heal(creep);
       }
      else{
          let allies = creep.room.find(FIND_MY_CREEPS)
          let damagedAllies = _.filter(allies, damagedAlly => damagedAlly.hits < damagedAlly.hitsMax);
          let closestAlly = creep.pos.findClosestByRange(damagedAllies);
          
          if(creep.heal(closestAlly) == ERR_NOT_IN_RANGE){
              if(creep.rangedHeal(closestAlly) == ERR_NOT_IN_RANGE){
                  creep.moveTo(closestAlly);
              }
              else{
                  creep.moveTo(closestAlly);
              }
          }
      }
      if(creep.memory.squadNumber != undefined){
          let squadLeader = _.filter(Game.creeps, sqLeader => sqLeader.memory.squadNumber == creep.memory.squadNumber && sqLeader.memory.squadLeader == true);
          if(squadLeader.length != 0 && !(squadLeader[0].spawning)){
            creep.moveTo(squadLeader[0]);
          }
          else{
              if(creep.room.name == creep.memory.homeRoom){
                  if(creep.ticksToLive > 1580){
                      let spawnBro = creep.room.find(FIND_STRUCTURES);
                      spawnBro = _.filter(spawnBro, x => x.structureType == STRUCTURE_SPAWN);
                      creep.moveTo(spawnBro[0]);
                  }
                  else creep.moveTo(creep.room.controller);
              }
              else if (creep.room.name != creep.room.homeRoom) mechanicsRemote.goToRoom(creep, creep.room.homeRoom);
              
          }
      }
      else{
          mechanicsRemote.goToRoom(creep, creep.room.homeRoom);
      }
  }
};

module.exports = roleHealer;