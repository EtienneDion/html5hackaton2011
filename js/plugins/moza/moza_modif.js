(function ($, undef) {
	"use strict";

    var sequence = [],
    level = 3;

	var Moza = {};
	window.Moza = Moza;

    $.fn.generateSequence = function (options) {
        sequence = [];
        for(var i=1;i<=level;i++){
            var random = Math.round(Math.random()*3) +1;
            sequence.push(random);
        }
        console.log("Sequence:"+sequence);
    };


	/**
	* Define grid specification
	*/
	$.fn.showGrid = function (options) {
		var ctn = this,
			grid,
			settings = {
				stage: {
					width: this.width(),
					height: this.height()
				},
				grid: {
					width: 10,
					height: 5
				},
				//l = large, m = medium, s = small
				//just create more if you need it. ex: xl for xlarge :)
				tile: {
					big : {
						max: 1,
						width: 3,
						height: 3
					},
					medium : {
						max: 6,
						width: 2,
						height: 2
					},
					small : {
						max: 40,
						width: 1,
						height: 1
					}
				},
				testmode: false,
				random: true,
				Items: 30
			},
			Coords = {
				all: [],
				free: [],
				taken: []
			},
			History = [],
			tileWidth = '',
			tileheight = '',
			x = 0,
			y = 0;

		// Merge the default and user settings
		if (options) {
			//settings = $.extend(settings, options);
			History = $.extend(History, options);
		}
		console.log(History);
		var height = this.height();
		var width = this.width();
		var canvas;
		var stage;
		
		var container;
		var txt;
		var simon= [];
		canvas = document.getElementById("stage");
		stage = new Stage(canvas);

		// Create a new Text object and a rectangle Shape object, and position them inside a container:
		container = new Container;
		container.x = 0;
		container.y = 0;


		function Coord(x, y) {
			this.x = x;
			this.y = y;
		}

        function chooseColor(){
				var colors = new Array(14)
				colors[0]="0";
				colors[1]="1";
				colors[2]="2";
				colors[3]="3";
				colors[4]="4";
				colors[5]="5";
				colors[5]="6";
				colors[6]="7";
				colors[7]="8";
				colors[8]="9";
				colors[9]="a";
				colors[10]="b";
				colors[11]="c";
				colors[12]="d";
				colors[13]="e";
				colors[14]="f";

				var digit = new Array(5);

			    var color = "#"+colors[Math.round(Math.random()*14)]+""+colors[Math.round(Math.random()*14)]+""+colors[Math.round(Math.random()*14)]+""+colors[Math.round(Math.random()*14)]+""+colors[Math.round(Math.random()*14)]+""+colors[Math.round(Math.random()*14)];

				return color;
		}

		function Tile(size, callNumber) {
			var i, tile, tileSize;
			tile = this;
            tile.id = callNumber;
			tile.size = size;
			tile.width = settings.tile[size].width;
			tile.height = settings.tile[size].height;
			tile.coord = null;
			tile.targets = [];
			tile.target = [];
            tile.color = chooseColor();
            tile.color_over = chooseColor();
            
			/**
			* Get all coords needed to place this tile
			*/
			this.getOccupationFromCoord = function (coord) {
				var i, j, coords = [];
				if (coord !== undef) {
					for (i = 0; i < this.width; i = i + 1) {
						for (j = 0; j < this.height; j = j + 1) {
							coords.push(new Coord(i + coord.x, j + coord.y));
						}
					}
					return coords;
				}
			};

			/**
			* DOWNGRADE THE SIZE IF NO SPACE IS AVAILABLE
			*/
			this.targets = grid.checkPlacabilityOfTile(this, callNumber);
			if (_.isEmpty(this.targets)) {
				for (tileSize in settings.tile) {
					if (settings.tile[tileSize].width < this.width) {
						tile.width = settings.tile[tileSize].width;
						tile.height = settings.tile[tileSize].height;
						tile.size = tileSize;
						tile.targets = grid.checkPlacabilityOfTile(this, callNumber);
					}
				}
			}
			tile.target = this.targets[0];
		}

		Moza.Coord = Coord;
		Moza.Tile = Tile;
		Moza.Data = Tile;

		// TODO sort the array of tile size
		// tips: sort the array of tile by size. the bigger at the top. will be more easy that way when will play with loop

		function Grid(x, y) {
			var grid = this;
			grid.Coords = Coords;
			grid.tileWidth = settings.stage.width / settings.grid.width;
			grid.tileHeight = settings.stage.height / settings.grid.height;
			this.checkPlacabilityOfTile = function (tile, calNumber) {
				// Iterate across each free coordinates to test if the tile can be placed
				// var 
				var i, freeCoord, targets = [], t, coords;
				for (i = 0; i < this.Coords.free.length; i += 1) {
					freeCoord = this.Coords.free[i];
					if ((freeCoord.x + tile.width) * grid.tileWidth <= settings.stage.width && (freeCoord.y + tile.height) * grid.tileHeight <= settings.stage.height) {
						coords = tile.getOccupationFromCoord(freeCoord);
						if (this.checkAvailabilityOfCoordsFromCoord(coords)) {
							targets.push(freeCoord);
						}
					}
				}
				if (settings.random === true) {
					this.shuffle(targets);
				}
				return targets;
			};

			this.checkAvailabilityOfCoordsFromCoord = function (coords) {
				var i, y = 0, j;
				for (j = 0; j < coords.length; j += 1) {
					i = this.Coords.free.length;
					while (i--) {
						if (this.Coords.free[i].x === coords[j].x && this.Coords.free[i].y === coords[j].y) {
							y += 1;
						}
					}
				}
				if (coords.length === y) {
					return true;
				} else {
					return false;
				}
			};
			
			this.putFreeCoorToTakenCoor = function (coord) {
				var i;
				for (i = 0; i < grid.Coords.free.length; i += 1) {
					if (grid.Coords.free[i].x === coord.x && grid.Coords.free[i].y === coord.y) {
						grid.Coords.free.splice(i, 1);
					}
				}
				grid.Coords.taken.push(coord);
			};

			this.shuffle = function (array) {
				var j, x, i;
				for (j, x, i = array.length; i; j = parseInt(Math.random() * i, 10), x = array[--i], array[i] = array[j], array[j] = x) {
				}
				return array;
			};

			this.build = function () {
				/*
				* Build a multi dimensional array for all the position available
				*/
				var i, j;
				for (i = 0; i < x; i += 1) {
					for (j = 0; j < y; j += 1) {
						this.Coords.all.push(new Coord(i, j));
					}
				}

				// Clone the arrayY of all position and add it to free position array.
				this.Coords.free = _.clone(this.Coords.all);
				return this.Coords;
			};

			/**
			* Get all the info about the tile. (position, size, id, title, etc.)
			*/
			this.getTileInfos = function(tile, item) {
				var infos = {}, newImageSize;
				infos = {
					size: tile.size,
					x: tile.target.x * settings.stage.width / settings.grid.width,
					y: tile.target.y * settings.stage.height / settings.grid.height,
					width: tile.width * settings.stage.width / settings.grid.width,
					height: tile.height * settings.stage.height / settings.grid.height,
					imageTop: 0,
					imageLeft: 0,
                    color: tile.color,
                    color_over:tile.color_over
				};
                
				return infos;
			};
			

			/**
			* Show tile one after the other.
			*/

			this.showTile = function(tile, i) {
				var tileTmpl, tileCtn, animSpeed = 50;
				if (i === undefined) {
					i = 0;
				}

				// NOTE A ETIENNE: ta inverse le x et le y mouhaha. tout etait ok
				var tile_top = tile[i].x,
					tile_left = tile[i].y,
					tile_width = tile[i].width,
					tile_height = tile[i].height,
					color = tile[i].color,
					color_over = tile[i].color_over;

                simon= new Shape();
                simon.graphics.beginFill(color).drawRect(tile_top, tile_left, tile_width, tile_height).beginFill(color);


				simon.onClick = function(evt) {

                    this.graphics.beginRadialGradientStroke(["#FFF","#000"],[0,1],150,300,0,150,300,200).drawRect(tile_top, tile_left, tile_width, tile_height).beginRadialGradientStroke(["#FFF","#000"],[0,1],150,300,0,150,300,200);
                    console.log(this.id);


                    stage.update();
				}
               


				container.addChild(simon);

				if (i + 1 < tile.length) {
					grid.showTile(tile, i +1);
					stage.update();
				} else {
					stage.addChild(container);
				    stage.update();
				}
			}

			this.recordTileInfos = function (tile) {
				var lastEntry;
				History.push(tile);
				lastEntry = History[History.length-1];
				//console.log(lastEntry);
			}

			/**
			* Place the tile in the grid.
			*/
			this.placeTiles = function () {
				var i, j, tile, size = 'medium', tileOccupationCoords, tileQueue = [];
				for (i = 0; i < settings.Items; i += 1) {
					if (!_.isEmpty(grid.Coords.free)) {
						if (i < settings.tile.big.max) {
							size = 'big';
						} else if (i < settings.tile.big.max + settings.tile.medium.max) {
							size = 'medium';
						} else {
							size = 'small';
						}
						tile = new Tile(size, i);
						if(i == 0 || i == 10){
							grid.recordTileInfos(tile);
						}
						// get all the coord needed for that tile
						tileOccupationCoords = tile.getOccupationFromCoord(tile.target);
						// remove the needed coords in the free array and put them in the taken array
						for (j = 0; j < tileOccupationCoords.length; j += 1) {
							grid.putFreeCoorToTakenCoor(tileOccupationCoords[j]);
						}
						//add info to queue
						tileQueue[i] = grid.getTileInfos(tile, settings.Items[i]);
					}
				}
				grid.showTile(tileQueue);
				//console.log(Coords.history);
				$('#resetGrid').click(function(ev){
					ev.preventDefault();
					$('#stage').showGrid(History);
				});
			};
		}


        function playSequence () {

        $().generateSequence();
            
        $(sequence).each(function (e){
            var timeoutID = window.setTimeout(function(){
               // grid.showTile(history, 1);
                console.log(sequence[e]);
                }, (e+1)*1000);
            /*
            var timeoutID2 = window.setTimeout(function(){
             //   $("#"+sequence[e]).css("backgroundColor","black");

            }, (e+1)*1000+500+((e+1)*100));
            */
        });


		// Build the grid
		grid = new Grid(settings.grid.width, settings.grid.height);
		grid.build();
		grid.placeTiles();

	};
}(jQuery));


$(function () {
    $().generateSequence();
	$('#stage').showGrid();
	
});


