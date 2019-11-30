var mechanicsRemote = require('mechanics.remote');

var rangedAttacker = {
    run: function(creep){
        creep.say('haha nub', {public: true});
        
        if(creep.getActiveBodyparts(TOUGH) == 0){
            mechanicsRemote.goToRoom(creep, creep.memory.homeRoom);
            creep.memory.repairing = true
            let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            let victim = creep.pos.findClosestByRange(hostiles);
            if(victim != null){
                    creep.rangedAttack(victim);
            }
            if(creep.memory.homeRoom == creep.room.name){
                creep.moveTo(creep.room.controller);
            }
        }
        else{
            if(creep.hits == creep.hitsMax){
                    creep.memory.repairing = false;
                }
            
            if(creep.memory.guardRoom != creep.room.name){
                console.log('wtf');
                mechanicsRemote.goToRoom(creep, creep.memory.guardRoom);
            }
            else{
                let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                let victim = creep.pos.findClosestByRange(hostiles);
                if(victim != null){
                    if(creep.rangedAttack(victim) == ERR_NOT_IN_RANGE){
                        creep.moveTo(victim);
                    }
                    else{
                        let diffX = creep.pos.x - victim.pos.x;
                        let diffY = creep.pos.y - victim.pos.y;
                        if(diffX > 0 && diffY > 0){
                            //let toPos = new RoomPosition(creep.x + 1, creep.y -1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(BOTTOM_RIGHT);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX > 0 && diffY == 0){
                            //let toPos = new RoomPosition(creep.x + 1, creep.y, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(RIGHT);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX > 0 && diffY < 0){
                            //let toPos = new RoomPosition(creep.x + 1, creep.y + 1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(TOP_RIGHT);
                            //}
                            //else{
                                creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX < 0 && diffY > 0){
                            //let toPos = new RoomPosition(creep.x - 1, creep.y -1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(BOTTOM_LEFT);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX < 0 && diffY == 0){
                            //let toPos = new RoomPosition(creep.x - 1, creep.y, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(LEFT);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX < 0 && diffY > 0){
                            //let toPos = new RoomPosition(creep.x - 1, creep.y + 1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(TOP_LEFT);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX == 0 && diffY > 0){
                            //let toPos = new RoomPosition(creep.x, creep.y +1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(BOTTOM);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                        if(diffX == 0 && diffY < 0){
                            //let toPos = new RoomPosition(creep.x, creep.y -1, creep.room.name);
                            //if(this.IsOkToWalk(toPos)){
                                creep.move(TOP);
                            //}
                            //else{
                            //    creep.moveTo(creep.room.controller);
                            //}
                        }
                    }
                }
                else creep.moveTo(creep.room.controller, {range: 6});
            }
        }
    }
};


module.exports = rangedAttacker;