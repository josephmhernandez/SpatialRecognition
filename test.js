
var game = new Phaser.Game(400, 550, Phaser.AUTO, '', {
	preload: preload,
	create: create,
	update: update,
	render: render
}) 

const POPULATION = 350; //bird Population

var pipes; 
var heads; 
var height_game = 550; //Height of the Game !!!! Either 550 or 500; 
var width_game = 400; 
var birds;
 
var score = 0; 
//var brain; 
var keepGoing = false; 
var brains = []; 
var savedBirds; 
var savedScores = []; 
var birdFitness = []; 
var savedBrains = []; 

var GEN_Count = 0; 

var newGenBool = false; 

function preload() {
	//game.load.image('bird', 'assets/bird.png');
	//game.load.image('pipe', 'assets/pipe.png'); 
	//game.load.image('pipeNorth', 'assets/pipe-down.png'); 
	//game.load.image('pipeSouth', 'assets/pipe-up.png'); 
}


function create() {
	if(newGenBool){
		//NEW GENERATION??????????????????????????????????????????
		GEN_Count++; 
		console.log("NEW GEN BOYS" + GEN_Count); 

		// BRAIN_INDEX = pickOne(); 
		brainsTemp = []
		

		savedScores = []; 
		score = 0; 


		game.physics.startSystem(Phaser.Physics.ARCADE);

		birds = game.add.group(); 
		birds.enableBody = true; 


		//create population of birds
		for (i = 0; i<POPULATION; i++){
			randy = Math.floor(Math.random() * 400) + 20;
			tempBird= game.add.sprite(150, randy, 'bird'); 
			//add temp bird to bird population: 
			birds.add(tempBird); 
			BRAIN_INDEX = pickOne(); 
			// console.log('brain Stuff inbound:'); 
			// console.log(BRAIN_INDEX); 
			// console.log(savedBrains); 
			// console.log(savedBrains[BRAIN_INDEX]); 

			brain = savedBrains[BRAIN_INDEX].copy(); 
			brain.mutate(0.1); 
			//SHOULD BE MUTATING 
			brainsTemp[i] = brain; 
		}

		birdFitness = []; 
		savedBrains = []; 

		//console.log("birds created: ", birds.length); 

		for (b = 0; b< birds.length; b++){

			game.physics.enable(birds.children[b], Phaser.Physics.ARCADE); 
			birds.children[b].body.velocity.setTo(0, -200); 
			birds.children[b].body.gravity.set(0, 500);  
			birds.children[b].body.collideWorldBounds = true; 


			birds.children[b].checkWorldBounds = true; 
			//birds.children[b].events.onOutOfBounds.add(destroyBird, this); 
		}



		
		pipes = game.add.group(); 
		heads = game.add.group(); 
		heads.enableBody = true; 
		pipes.enableBody = true; 
		savedBirds = game.add.group(); 
		//console.log('savedBirds' + savedBirds); 


		game.time.events.loop(Phaser.Timer.SECOND * 2.1, generatePipe, this); 
		//generatePipe(); 

		savedScores = []; 
		savedBrains = []; 
		brains = []; 
		brains = brainsTemp;

		// birdFitness = [];

	}
	else{
		console.log('START NEW GAME:::::'); 
		GEN_Count++; 
		savedScores = []; 
		brains = [];
		savedBrains = []; 

		game.physics.startSystem(Phaser.Physics.ARCADE);

		birds = game.add.group(); 
		birds.enableBody = true; 


		//create population of birds
		for (i = 0; i<POPULATION; i++){
			randy = Math.floor(Math.random() * 400) + 20;
			tempBird= game.add.sprite(150, randy, 'bird'); 
			//add temp bird to bird population: 
			birds.add(tempBird); 
			brain = new NeuralNetwork(3, 7, 2); 
			brains[i] = brain; 
			//console.log('brain created'); 
		}

		//console.log("birds created: ", birds.length); 

		for (b = 0; b< birds.length; b++){

			game.physics.enable(birds.children[b], Phaser.Physics.ARCADE); 
			birds.children[b].body.velocity.setTo(0, -200); 
			birds.children[b].body.gravity.set(0, 500);  
			birds.children[b].body.collideWorldBounds = true; 


			birds.children[b].checkWorldBounds = true; 
			//birds.children[b].events.onOutOfBounds.add(destroyBird, 2); /////////////////////////FOR BOTH CONSTRUCTORS>>>>. ADDING SAVED SCORES TO THE array and making sure we've got 10 scores. 
		}



		
		pipes = game.add.group(); 
		heads = game.add.group(); 
		heads.enableBody = true; 
		pipes.enableBody = true; 
		savedBirds = game.add.group(); 

		//console.log("EXECUTE WHEN NEW GAME"); 
		birdFitness = []; 

		game.time.events.loop(Phaser.Timer.SECOND * 2.1, generatePipe, this); 
		// generatePipe(); 

	}
	//NeuralNetwork(inputs, hidden, outputs); 
	//output < .5 don't jump
	//output > .5 jump
	//TO DO: Look at if it's better with more or less hideden layer nodes
	//brain = new NeuralNetwork(3, 3, 1); 
	
}


function update() {
	score += .2; 

	// for(i = 0; i<birds.length; i++){
	// 	//Ask neural network given the state of the game if we should jump.

	// }
	 


	//User can user keyboard to jump. 
	
	if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
		birds.children[0].body.velocity.setTo(0, -200); 	
	}
	


	//Phaser method to tell if the bird has hit a pipe. 
	// 	If it has then collisio	nDetected() is called.
	

	for(i = 0; i<birds.length; i++){
		//if(birds.children[i].events.onOutOfBounds.add(destroySprite, this); 
		outs = think(i); 

		if (outs[0] > outs[1]){
			birds.children[i].body.velocity.setTo(0, -200); 
		}


		if(this.game.physics.arcade.collide(birds.children[i], pipes, null, null, this)){

			//savedScores[i] = score; 
			// console.log("len inc " +savedScores.length); 
			// console.log(savedScores); 
			savedScores.push(Math.floor(score)); 
			savedBrains.push(brains[i]); 

			brains.splice(i, 1); 

			destroyBird(i);
			break; 
		}
// || birds.children[i].y > 500
		if(birds.children[i].y <= 10 || birds.children[i].y >= 500){
			//savedScores[i] = score; 
 
			savedScores.push(score); 
			savedBrains.push(brains[i]); 

			brains.splice(i, 1); 

			destroyBird(i); 
			break; 
		}
	
		// if(heads.length > 0 && keepGoing == true){
		// 	if (heads.children[0].x < 150){
		// 		generatePipe();
		// 		keepGoing = false;  
		// 	}
		// }	
		
	}



	if(birds.length == 0){
		calcFitness(); 
		newGeneration(); 
	}
	 

	
}


function render(){
	/*
	index = getIndexPipe(); 

	game.debug.text("bird y:" + userBird.y, 32, 65); 

	diff_x = 300; 
	diff_y = 220; 

	if(index != null){
		diff_x = getDistx(index); 
		diff_y = getDisty(index); 
	}

	game.debug.text('PIPE:' + diff_x, 32, 32);
	game.debug.text('PIPE_y:' + diff_y, 32, 46);  
	*/

	// game.debug.text('index of pipe' + score, 32, 46); 


	// game.debug.text('Number of birds left:' + birds.length, 32, 32); 
	
	// // // tempHeight = 51; 
	// tempHeight = 12; 
	// for(i = 0; i < birds.length; i++){
	// 	tempHeight += 14;

	// 	if(getIndexPipe(i) != null){
	// 		pipeX = getDistx(i); 
	// 		pipeY = getDisty(i); 
	// 	}
	// 	//Define inputs to neural network function. 
	// 	//Normalize variables to be between 0 and 1. 
	// 	x1= birds.children[i].y / height_game;
	// 	x2 = pipeX / width_game; 
	// 	x0 = pipeY / height_game; 




	// 	game.debug.text('scores:' + x1 + ';' + x2 +';' + x0, 32, tempHeight); 

	// }



}

function getSeed(){
	return Math.floor(Math.random() * 5) + 1; 
}

function generatePipe(){
	x = 400; 
	gap = 200; 

	seed = getSeed(); 
   
	n_pipe = game.add.sprite(x, 0, 'pipe');
	n_pipe.height = seed*55;

	pipe_tail = game.add.sprite(x, n_pipe.height, 'pipeNorth');

	s_pipe = game.add.sprite(x, n_pipe.height + gap, 'pipe'); 
	s_pipe.height = 550 - (n_pipe.height + gap); 
	pipe_head = game.add.sprite(x, n_pipe.height + gap, 'pipeSouth'); 

	game.physics.enable(n_pipe, Phaser.Physics.ARCADE);
	game.physics.enable(s_pipe, Phaser.Physics.ARCADE);
	game.physics.enable(pipe_head, Phaser.Physics.ARCADE);
	game.physics.enable(pipe_tail, Phaser.Physics.ARCADE);

	n_pipe.body.immovable = true; 
	s_pipe.body.immovable = true;
	pipe_head.body.immovable = true;
	pipe_tail.body.immovable = true;

	n_pipe.body.velocity.x = -80; 
	s_pipe.body.velocity.x = -80; 
	pipe_head.body.velocity.x = -80; 
	pipe_tail.body.velocity.x = -80; 

	n_pipe.checkWorldBounds = true; 
	s_pipe.checkWorldBounds = true; 
	pipe_head.checkWorldBounds = true; 
	pipe_tail.checkWorldBounds = true; 

	n_pipe.events.onOutOfBounds.add(destroySprite, this); 
	s_pipe.events.onOutOfBounds.add(destroySprite, this); 
	pipe_head.events.onOutOfBounds.add(destroySprite, this); 
	pipe_tail.events.onOutOfBounds.add(destroySprite, this); 

	pipes.add(s_pipe); 
	pipes.add(n_pipe); 
	pipes.add(pipe_tail); 
	pipes.add(pipe_head); 

	heads.add(pipe_head); 

	//console.log('create obj'); 
}

function destroySprite(sprite) { 

	sprite.destroy();
	// if(birds.length > 0){
	// 	//generatePipe(); 
	// }
}



function destroyBird(i){	
	//console.log("hi" + i); 
	//console.log('destroyed bird'); 
	birds.children[i].destroy(); 
	keepGoing = true; 
}
 


function getDistx(index){

	return (heads.children[index].x); 
}

function getDisty(index){

	return heads.children[index].y; 
}


function getIndexPipe(myBird){
	min_dist = 100; 

	for(h =0; h<heads.length; h++){
		min_dist = myBird.x - heads.children[h].x;
		if(min_dist <= 10){
			return h; 
		}
	}

	return null;
}


function think(i) {
	//Initialize inputs variable. 
	inputs = []; 

	//Obtain inputs: inputs = [Bird.Y, pipeHead.X, pipeHead.Y]

	index = getIndexPipe(birds.children[i]);  

	//Set dummy values as to not mess up the program before pipes 
	//	are added into the game (pipes on a delay of 2.1 seconds). 
	pipeX = 0; 
	pipeY = 0; 

	if(index != null){
		pipeX = 150 - getDistx(index); 
		pipeY = getDisty(index); 
	}

	//Define inputs to neural network function. 
	//Normalize variables to be between 0 and 1. 
	inputs[2] = birds.children[i].y / height_game;
	inputs[1] = pipeX / width_game; 
	inputs[0] = pipeY / height_game; 
	

	//console.log(brains[i]); 
	 
	if(brains[i] != undefined){
		output = brains[i].predict(inputs); 
	}else{
		//console.log('brain ' + i + ' : undefined'); 
	}

	return output;
}

function newGeneration(){ 
	newGenBool = true; 
	this.game.state.restart(); 	
}

function calcFitness(){
	//Use pop because the first element is being added as the back IDK why
	//savedScores.pop(); 
	// console.log(savedScores.length); 
	// console.log('savedScores Inbound:'); 
	// console.log(savedScores); 


	let sum = 0; 
	for(i = 0; i<savedScores.length; i++){
		sum+= savedScores[i]; 
	}

	// console.log('blow up if sum = 0'); 
	for(i = 0; i<savedScores.length; i++){
		birdFitness[i] = (savedScores[i] / sum); 
	}

	savedScores = []

	

}

function pickOne(){
	// console.log('pickONe options'); 
	// console.log(birdFitness); 

	var index = 0; 
	var r = Math.random(1); 

	while(r > 0){
		r = r - birdFitness[index]; 
		index++; 
	}

	index--; 

	//console.log(index); 
	return index; 
}