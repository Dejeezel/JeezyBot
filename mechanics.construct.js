var mechanicsConstruct = {
    run: function(roomie){
        if(roomie.memory.autoConstruct == true){
            var areaStart = roomie.memory.areaStart;
            var layout = roomie.memory.layout;
            var extensions = roomie.find(FIND_STRUCTURES, { filter: {structureType: STRUCTURE_EXTENSION}});
            var towers = roomie.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
            var extensionsOnConstruction = roomie.find(FIND_CONSTRUCTION_SITES, { filter: {structureType: STRUCTURE_EXTENSION}});
            
            function isMissingConstructions(){
                let roomLevel = roomie.controller.level;
                
                switch(roomLevel){
                    case 1:
                        return true;
                        break;
                    case 2:
                        if((extensions.length + extensionsOnConstruction.length) < 5) return true;
                        else return false;
                        break;
                    case 3:
                        if((extensions.length + extensionsOnConstruction.length) < 10) return true;
                        else return false;
                        break;
                    case 4:
                        if((extensions.length + extensionsOnConstruction.length) < 20) return true;
                        else return false;
                        break;
                    case 5:
                        if((extensions.length + extensionsOnConstruction.length) < 30) return true;
                        else return false;
                        break;
                    case 6:
                        if((extensions.length + extensionsOnConstruction.length) < 40) return true;
                        else return false;
                        break;
                }
            }
                if(roomie.memory.areaStart == undefined){
                    var i = 3;
                    var j = 3;
                    var possibleAreas = [];
                    const areaNumber = 13;
                    for(i = 3; j < (47 - areaNumber); i++){
                        let area = roomie.lookForAtArea(LOOK_TERRAIN, j, i, (j+areaNumber), (i+areaNumber), true);
                        let areaFiltered = _.filter(area, x => x.terrain == 'wall');
                        if(areaFiltered.length == 0){
                            possibleAreas = possibleAreas.concat([{x: i+1, y: j}]);
                        }
                        if(i == (47 - areaNumber)){
                            i = 3;
                            j++;
                        }
                    }
                    console.log(possibleAreas.length + ' posibles lugares');
                    if(possibleAreas.length == 0){
                        roomie.memory.autoConstruct = false;
                    }
                    else{
                        possibleAreas = _.map(possibleAreas, area => new RoomPosition(area.x, area.y, roomie.name));
                        const finalArea = roomie.controller.pos.findClosestByRange(possibleAreas);
                        console.log(finalArea.x, + ' ' + finalArea.y);
                        roomie.memory.areaStart = finalArea;
                        roomie.memory.layout = 1;
                        roomie.createFlag(finalArea, 'aS');
                    }
                }
                else if(isMissingConstructions() && layout == 1){
                    console.log('Constructing...');
                    for(var i = 1; i <= roomie.controller.level; i++){
                        if(i == 1){
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 5, STRUCTURE_SPAWN, roomie.name + 'uan');
                        }
                        if(i == 2){
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 1, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 1, STRUCTURE_ROAD);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 2, STRUCTURE_ROAD);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 3, STRUCTURE_ROAD);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 4, STRUCTURE_ROAD);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 3, STRUCTURE_CONTAINER);
                        }
                        if(i == 3){
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 3, STRUCTURE_TOWER);
                            if(towers.length > 0){
                                roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 2, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 1, STRUCTURE_ROAD);
                            }
                        }
                        if(i == 4){
                            roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 5, STRUCTURE_STORAGE);
                            if(roomie.storage != undefined){
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x, areaStart.y + 2, STRUCTURE_EXTENSION);
                            }
                        }
                        if(i == 5){
                            roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 3, STRUCTURE_TOWER);
                            if(towers.length > 1){
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 9, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 10, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 2, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 1, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 4, STRUCTURE_ROAD);
                            }
                        }
                        if(i == 6){
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 6, STRUCTURE_TERMINAL);
                            roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 10, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 10, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 9, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 11, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 10, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 7, STRUCTURE_ROAD);
                            roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 8, STRUCTURE_ROAD);
                        }
                    }
                }
             else if(isMissingConstructions() && layout == 2){
                    console.log('Constructing...');
                    for(var i = 1; i <= roomie.controller.level; i++){
                        if(i == 1){
                            roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 7, STRUCTURE_SPAWN);
                        }
                        if(i == 2){
                            roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 5, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 5, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 0, areaStart.y + 5, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 5, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 5, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 7, STRUCTURE_CONTAINER);
                        }
                        if(i == 3){
                            roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 5, STRUCTURE_TOWER);
                            if(towers.length > 0){
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 6, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 5, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 6, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 6, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 6, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 5, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 4, STRUCTURE_ROAD);
                            }
                        }
                        if(i == 4){
                            roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 7, STRUCTURE_STORAGE);
                            if(roomie.storage != undefined){
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 0, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 0, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 5, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 8, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 7, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 0, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 9, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 9, STRUCTURE_EXTENSION);
                            }
                        }
                    }
             }
             else if(isMissingConstructions() && layout == 3){
                    console.log('Constructing...');
                    for(var i = 1; i <= roomie.controller.level; i++){
                        if(i == 1){
                            roomie.createConstructionSite(areaStart.x + 7, areaStart.y + 5, STRUCTURE_SPAWN);
                        }
                        if(i == 2){
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 2, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 3, STRUCTURE_EXTENSION);
                            roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 3, STRUCTURE_CONTAINER);
                        }
                        if(i == 3){
                            roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 3, STRUCTURE_TOWER);
                            if(towers.length > 0){
                                roomie.createConstructionSite(areaStart.x + 8, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 5, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 9, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 4, STRUCTURE_ROAD);
                            }
                        }
                        if(i == 4){
                            roomie.createConstructionSite(areaStart.x + 6, areaStart.y + 5, STRUCTURE_STORAGE);
                            if(roomie.storage != undefined){
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 3, areaStart.y + 4, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 2, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 1, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y +  4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 1, areaStart.y + 1, STRUCTURE_EXTENSION);
                            }
                        }
                        if(i == 5){
                            roomie.createConstructionSite(areaStart.x + 4, areaStart.y + 3, STRUCTURE_TOWER);
                            if(towers.length > 1){
                                roomie.createConstructionSite(areaStart.x + 2, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 12, areaStart.y + 4, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 12, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 13, areaStart.y + 3, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 13, areaStart.y + 2, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 13, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 12, areaStart.y + 1, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 12, areaStart.y, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 10, areaStart.y + 0, STRUCTURE_EXTENSION);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 3, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 12, areaStart.y + 2, STRUCTURE_ROAD);
                                roomie.createConstructionSite(areaStart.x + 11, areaStart.y + 1, STRUCTURE_ROAD);
                            }
                        }
                    }
             }
        }
    }
};

module.exports = mechanicsConstruct;