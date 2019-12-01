var spawningMechanics = {
    run: function(_spawn){
        const target = undefined;
        const target2 = undefined;
        const easyTarget = undefined;
        const mineral = _spawn.room.find(FIND_MINERALS)[0]
        var robRoom = undefined;
        var claimTarget = undefined;
        var cantidadUpgraders = 2;
        var suficienteEnergyEnStorage;
        if(_spawn.room.storage != null) var suficienteEnergyEnStorage = _spawn.room.storage.store[RESOURCE_ENERGY] > 20000
        if(_spawn.room.storage != null && suficienteEnergyEnStorage && _spawn.room.controller.level != 8){
            cantidadUpgraders = 3
        }
        if(_spawn.room.storage != null && _spawn.room.storage.store[RESOURCE_ENERGY] < 10000 && _spawn.room.controller.level != 8){
            cantidadUpgraders = 1
        }
        var cantidadBuilders = 1;
        if(_spawn.room.controller.level <= 4) cantidadBuilders = 2;
        if(_spawn.room.controller.level < 3) cantidadBuilders = 3;
        var cantidadHarvesters = 1;
        var reserveExits = _.map(Game.map.describeExits(_spawn.room.name), exit => exit);
        reserveExits = _.filter(reserveExits, roomName => _spawn.room.memory.keeperRoom != roomName && _spawn.room.memory.otherRoom != roomName);
        var maxEnergy = _spawn.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION}});
        maxEnergy = maxEnergy.concat(_spawn.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_SPAWN}}));
        var energyNow = _.sum(maxEnergy.map(x => x.energy));
        maxEnergy = _.sum(maxEnergy.map(x => x.energyCapacity));
        var constructions = _spawn.room.find(FIND_CONSTRUCTION_SITES);
        var reservedRooms = _.filter(Game.rooms, reserved => (reserved.memory.mainRoom == _spawn.room.name));
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.homeRoom == _spawn.room.name && creep.memory.isAlwaysUpgrading == undefined);
        var mineralists = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineralist' && creep.memory.homeRoom == _spawn.room.name);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.homeRoom == _spawn.room.name);
        var remoteBuilders = _.filter(builders, rBuilder => rBuilder.memory.remote == true);
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.homeRoom == _spawn.room.name);
        var remoteMiners = _.filter(miners, rMiner => rMiner.memory.remote == true);
        var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.memory.homeRoom == _spawn.room.name);
        var remoteHaulers = _.filter(haulers, rHauler => rHauler.memory.remote == true);
        var reservers = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver' && creep.memory.homeRoom == _spawn.room.name);
        var upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'harvester' && creep.memory.homeRoom == _spawn.room.name && creep.memory.isAlwaysUpgrading);
        var innerHaulers = _.filter(Game.creeps, creep => creep.memory.role == 'innerHauler' && creep.memory.homeRoom == _spawn.room.name);
        var robberHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'robberHauler');
        var sources = _.filter(_spawn.room.find(FIND_SOURCES));
        var bodyStarter = [WORK,CARRY,MOVE];
        var reserveNearby = 0;
        var claimers = _.filter(Game.creeps, creep => creep.memory.role == 'controllerAttacker');
        reserveNearby = 1;
        if(maxEnergy >= 1300 && reserveExits.length > 1) reserveNearby = 2;
        
        if(constructions.length == 0) cantidadBuilders = 1;
        if(_spawn.room.controller.level < 4 || miners.length == 0) cantidadHarvesters = 2;
        
        function homoBody(){
            if(energyNow <= 300) return bodyStarter.concat([MOVE]);
            else if(energyNow == 350 || energyNow < 550){ return bodyStarter.concat([MOVE]); }
            else{
                var bodyFinal = bodyStarter.concat([MOVE]);
                var i = energyNow - 250;
                for(i ; i >= 250; i -= 250){
                    bodyFinal = bodyFinal.concat([WORK,MOVE,CARRY,MOVE]);
                    if(bodyFinal.length>=30) i = 0;
                }
                return bodyFinal;
            }
        }
        
        function harvesterBody(number){
            if(energyNow <= 300) return bodyFinal = [WORK,CARRY,MOVE,MOVE];
            if(energyNow == 300) { return bodyStarter.concat([MOVE]); }
            else if(energyNow == 350 || energyNow < 550){ return bodyStarter.concat([MOVE]); }
            else{
                var i = energyNow - 200;
                var bodyFinal = bodyStarter;
                for(i ; i >= 300; i -= 200){
                    bodyFinal = bodyFinal.concat([WORK,MOVE,CARRY]);
                    if(bodyFinal.length>=number) i = 0;
                }
                return bodyFinal;
            }
        }
        
        function upgraderBody(number){
            if(energyNow <= 300) return bodyFinal = [WORK,CARRY,MOVE];
            if(energyNow == 300) return bodyStarter.concat([WORK]);
            else if(energyNow == 400 || energyNow < 550) return bodyStarter.concat([WORK]);
            else{
                var i = energyNow - 250;
                var bodyFinal = bodyStarter;
                for(i ; i >= 300; i-= 250){
                    bodyFinal = bodyFinal.concat([WORK,WORK,MOVE]);
                    if(bodyFinal.length >= number) i = 0;
                }
                return bodyFinal;
            }
        }
        
        function haulerBody(number){
            if(energyNow <= 300) return bodyFinal = [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
            var bodyFinal = [CARRY, CARRY, MOVE];
            var i = energyNow - 150;
            for (i ; i > 100 ; i -= 150){
                bodyFinal = bodyFinal.concat([CARRY,CARRY,MOVE]);
                if(bodyFinal.length>=number) i = 0;
            }
            return bodyFinal;
        }
        
        function minerBody(){
            let bodyFinal = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
            if(energyNow >= 700 ){
                bodyFinal = bodyFinal.concat([WORK,MOVE]);
            }
            return bodyFinal;
        }
        function meleeBody(){
            var fixedAmount = Math.floor((maxEnergy / 190));
            fixedAmount = Math.min(fixedAmount, 12);
            var j = 0;
            var bodyFinal = [];
            for(var i = 0; i < fixedAmount; i++){
                if(j == 0){
                    bodyFinal = bodyFinal.concat([TOUGH]);
                }
                if(j == 1){
                    bodyFinal = bodyFinal.concat([MOVE]);
                }
                if(j == 2){
                    bodyFinal = bodyFinal.concat([ATTACK,MOVE]);
                }
                if(i == (fixedAmount - 1) && j != 2){
                    i = -1;
                    j++;
                }
            }
            return bodyFinal;
        }
        
        for(var i = 0; i < reservedRooms.length ; i++){
            let hostiles = reservedRooms[i].find(FIND_HOSTILE_CREEPS);
            let _remoteRangedDefenders = (Game.creeps, ranged => ranged.memory.role == 'rangedAttacker' && ranged.memory.defendRoom == reservedRooms[i].name);
            let _remoteHaulers = _.filter(haulers, x => x.memory.remote == true && x.memory.remoteRoom == reservedRooms[i].name);
            let _remoteMiners = _.filter(miners, x => x.memory.remote == true && x.memory.remoteRoom == reservedRooms[i].name);
            let _remoteBuilders = _.filter(builders, rBuilder => rBuilder.memory.remote == true && rBuilder.memory.remoteRoom == reservedRooms[i].name);
            let guards = _.filter(Game.creeps, guard => guard.memory.role == 'guard' && guard.memory.guardRoom == reservedRooms[i].name);
            let _sources = reservedRooms[i].find(FIND_SOURCES);
            let isReservePrepared = reservedRooms[i].memory.reservePrepared;
            if(_remoteBuilders.length < 1){
                var newName = 'RemoteBuilder' + Game.time;
                _spawn.spawnCreep(homoBody(), newName, { memory: { role: 'builder', homeRoom: _spawn.room.name, remoteRoom: reservedRooms[i].name, remote: true}})
            }
            else if(_remoteHaulers.length < _remoteMiners.length && isReservePrepared){
                var newName = 'RemoteHauler' + Game.time;
                _spawn.spawnCreep(haulerBody(30), newName, { memory: {role: 'hauler' , homeRoom: _spawn.room.name, remoteRoom: reservedRooms[i].name, remote: true}});
            }
            else if(_remoteMiners.length < _sources.length && isReservePrepared){
                var newName = 'RemoteMiner' + Game.time;
                _spawn.spawnCreep(minerBody(), newName, { memory: {role: 'miner' , homeRoom: _spawn.room.name, remoteRoom: reservedRooms[i].name, remote: true, upgrading: false}});
            }
        }
        if(mineralists < 1 && mineral.mineralAmount != 0 && _spawn.room.find(FIND_STRUCTURES, struct => struct.structureType == STRUCTURE_EXTRACTOR).length != 0 && _spawn.room.controller.level >= 6){
            var newName = 'Mineralist' + Game.time;
            _spawn.spawnCreep(harvesterBody(50), newName, { memory: { role: 'mineralist', homeRoom: _spawn.room.name}});
        }
        if(claimTarget != undefined && claimers.length < 1){
            var newName = 'Claimer' + Game.time;
            _spawn.spawnCreep([CLAIM,MOVE], newName, { memory: { role: 'controllerAttacker', homeRoom: _spawn.room.name, remoteRoom: claimTarget}});
        }
        if(robRoom != undefined && robberHaulers.length < 1 && maxEnergy >= 1300){
            var newName = 'Robber';
            _spawn.spawnCreep(haulerBody(), newName, { memory: {role: 'robberHauler' , homeRoom: _spawn.room.name, leechRoom: robRoom}});
        }
        if(builders.length < (cantidadBuilders + remoteBuilders.length)){
            var newName = 'Builder' + Game.time;
            _spawn.spawnCreep(homoBody(), newName, { memory: { role: 'builder', homeRoom: _spawn.room.name}});
        }
        if((haulers.length - remoteHaulers.length) < (miners.length - remoteMiners.length)){
            var newName = 'Hauler' + Game.time;
            _spawn.spawnCreep(haulerBody(20), newName, { memory: {role: 'hauler' , homeRoom: _spawn.room.name}});
        }
        if(upgraders.length < cantidadUpgraders){
            var newName = 'Upgrader' + Game.time;
            _spawn.spawnCreep(upgraderBody(20), newName, { memory: { role: 'harvester', homeRoom: _spawn.room.name, isAlwaysUpgrading: true}});
        }
        var roomsWeCanHelp = _.filter(Game.rooms, room => room.owner == _spawn.room.owner && room.controller != undefined && room.controller.level > 0 && _spawn.room.name != room.name && room.controller.level < 3);
        if(roomsWeCanHelp.length > 0){
            for(var i = 0; i < roomsWeCanHelp.length;i++){
                let _remoteBuilders = _.filter(builders, rBuilder => rBuilder.memory.remote == true && rBuilder.memory.remoteRoom == roomsWeCanHelp[i].name);
                let _remoteUpgraders = _.filter(upgraders, rUpgrader => rUpgrader.memory.remote == true && rUpgrader.memory.remoteRoom == roomsWeCanHelp[i].name);
                if(_remoteBuilders.length < 1){
                    var newName = 'RemoteBuilder' + Game.time;
                    _spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, { memory: { role: 'builder', homeRoom: _spawn.room.name, remoteRoom: roomsWeCanHelp[i].name, remote: true}});
                }
                if(_remoteUpgraders.length < 1 && roomsWeCanHelp[i].controller.level == 1){
                    var newName = 'RemoteUpgrader' + Game.time;
                    _spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, { memory: { role: 'harvester', isAlwaysUpgrading: true, homeRoom: _spawn.room.name, remoteRoom: roomsWeCanHelp[i].name, remote: true}});
                }
            }
        }
        if(easyTarget){
            let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeAttacker' && creep.memory.squadNumber == 0);
            if(attackers.length < 1){
                _spawn.spawnCreep(meleeBody(), 'trashRemover', { memory: { role: 'meleeAttacker', homeRoom: _spawn.room.name, isInvader: true, attackRoom: easyTarget, squadLeader: true, squadNumber: 0}});
            }
        }
        if(target && suficienteEnergyEnStorage){
            console.log('tumami');
            let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeAttacker' && creep.memory.squadNumber == 1);
            let healers = _.filter(Game.creeps, creep => creep.memory.role == 'healer' && creep.memory.squadNumber == 1);
            if(attackers.length < 1 && maxEnergy >= 2000 && healers.length > 2){
                _spawn.spawnCreep(meleeBody(), 'dreikenDaGad', { memory: { role: 'meleeAttacker', homeRoom: _spawn.room.name, isInvader: true, attackRoom: target, squadLeader: true, squadNumber: 1}});
            }
            if(healers.length < 3 && maxEnergy >= 2000){
                let newName = 'healer' + Game.time
                _spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE], newName, { memory: { role: 'healer', homeRoom: _spawn.room.name, squadNumber: 1}})
            }
        }
        if(target2 && suficienteEnergyEnStorage){
            console.log('tumami');
            let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'meleeAttacker' && creep.memory.squadNumber == 2);
            let healers = _.filter(Game.creeps, creep => creep.memory.role == 'healer' && creep.memory.squadNumber == 2);
            if(attackers.length < 1 && maxEnergy >= 2000 && healers.length > 2){
                _spawn.spawnCreep(meleeBody(), 'dreikenDaGad2', { memory: { role: 'meleeAttacker', homeRoom: _spawn.room.name, isInvader: true, attackRoom: target2, squadLeader: true, squadNumber: 2}});
            }
            if(healers.length < 3 && maxEnergy >= 2000){
                console.log('enough healers!');
                let newName = 'healer' + Game.time
                _spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE,HEAL,MOVE], newName, { memory: { role: 'healer', homeRoom: _spawn.room.name, squadNumber: 2}})
            }
        }
        if(reserveNearby > 0 && reservers.length < reserveNearby && haulers.length > 1){
            var newName = 'Reserver' + Game.time;
            _spawn.spawnCreep([CLAIM,CLAIM,MOVE,MOVE], newName, { memory: { role: 'reserver', homeRoom: _spawn.room.name}});
        }
        for(var i = 0; i < reservedRooms.length ; i++){
            let isReservePrepared = reservedRooms[i].memory.reservePrepared;
            let hostiles = reservedRooms[i].find(FIND_HOSTILE_CREEPS);
            //hostiles = _.filter(hostiles, hostile => hostile.owner.username != 'Invader');
            let guards = _.filter(Game.creeps, guard => guard.memory.role == 'guard' && guard.memory.guardRoom == reservedRooms[i].name);
            let remoteRangedDefenders = _.filter(Game.creeps, (ranged) => (ranged.memory.role === 'rangedAttacker' && ranged.memory.guardRoom === reservedRooms[i].name));
            if(guards.length < 1 && isReservePrepared){
                var newName = 'Guard of ' + reservedRooms[i].name;
                _spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,HEAL,MOVE], newName, { memory: {role: 'guard', homeRoom: _spawn.room.name, guardRoom: reservedRooms[i].name}})
            }
            if(hostiles.length > remoteRangedDefenders.length){
                var newName = 'nubDestroyer' + Game.time;
                console.log('LA CONCHA DE TU MADRE');
                _spawn.spawnCreep([TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE], newName, {memory: {role: 'rangedAttacker', homeRoom: _spawn.room.name, guardRoom: reservedRooms[i].name}});
            }
        }
        if(innerHaulers.length < 1 && _spawn.room.storage != undefined && _spawn.room.storage.store.energy > 2000){
            var newName = 'InnerHauler' + Game.time;
            _spawn.spawnCreep(haulerBody(20), newName, { memory: { role: 'innerHauler', homeRoom: _spawn.room.name}});
        }
        if(harvesters.length < cantidadHarvesters){
            if(energyNow < 600 && _spawn.room.controller.level >= 3){
                var newName = 'Harvester' + Game.time;
                if(harvesters.length == 0) _spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, { memory: { role: 'harvester', homeRoom: _spawn.room.name}});
            }
            var newName = 'Harvester' + Game.time;
            _spawn.spawnCreep(harvesterBody(30), newName, { memory: { role: 'harvester', homeRoom: _spawn.room.name}});
        }
        if((miners.length - remoteMiners.length) < sources.length){
            var newName = 'Miner' + Game.time;
            _spawn.spawnCreep(minerBody(), newName, { memory: { role: 'miner', homeRoom: _spawn.room.name, upgrading: false}});
        }
    }
};

module.exports = spawningMechanics;
