/*
Author:Zack Mryyan
Date: 4/3/2016
Class: EECS 368
collaborated with table
*/
tetrisGame = {};
tetrisGame.currentState = [];//holds the current value for the array
tetrisGame.initialized = false;
tetrisGame.falling = false;
tetrisGame.top = [];
tetrisGame.shapeLocation = [];//holds the location of each pixel in the shape 
tetrisGame.target = 0;
tetrisGame.timefalling = 0;
tetrisGame.points = 0;
tetrisGame.i = 199;


tetrisGame.initialize = function(){//initializes the game and configures the 20x10 board
	for (var i = 0; i < 10; i++) {
		for(var j = 0; j < 20; j++){
			this.currentState.push(-1);
		}
	}
	this.initialized = true;
};

tetrisGame.AddShape = function(shapeType, position, id){//this function constantly adds shapes to the playing board
	if(!this.initialized){this.initialize();}
	
	for(var i = 0; i<20; i++){//checks the top two rows of the game board
		this.top[i] = this.currentState[i];
	}
	this.DrawShape(shapeType, position, id);//draws the shape
	for(var j = 0; j<4; j++){
		if(this.top[this.shapeLocation[j]] != -1){//checks if the game is over
			AddToConsole("Game over");
		}
	}
	if(this.currentState[98] != -1 || this.currentState[99] != -1 || this.currentState[100] != -1 || this.currentState[101] != -1)//determines where the tallest columns are to analyze the solution better
	{
		this.i = 109;//top is halfway in the middle 
	}
	else
	{
		this.i = 199;//no blocks
	}
	this.timefalling = 0;
	this.falling = true;
	this.Analyze(shapeType);//calls to analyze the best position to place shape
};

tetrisGame.IncrementTime = function(){//increments the game to allow blocks to drop
	if(!this.initialized){this.initialize();}
	if(this.timefalling == 1){
		this.MoveShape(this.currentState[this.shapeLocation[0]], this.changePosition(this.shapeLocation[0]%10));//calls move shape function to move the blocks
	}
	if(this.shouldMove()){
		this.MoveShape(this.currentState[this.shapeLocation[0]], 10);
		this.timefalling++;
	}
	else{
		this.deleteRow();//calls the function to delete the line that is full 
		this.timefalling = 0;
		this.falling = false;
	}

};

tetrisGame.IsShapeFalling = function(){//returns if the shape is still falling
	if(!this.initialized){this.initialize();}
	return this.falling;
};

tetrisGame.GetCurrentState = function(){//returns the current state of each index of the array to tell if it is empty or contains a block
	if(!this.initialized){this.initialize();}
	return this.currentState;
};

tetrisGame.shouldMove = function(){ //check if the shape should be moved down
	var check;
	var x;
	for(var i = 0; i < 4; i++){

		x = this.shapeLocation[i] + 10;
		check = this.isPart(x);//checks if the part of the same shape is below
		if((this.currentState[this.shapeLocation[i]+10] === null) || ((this.currentState[this.shapeLocation[i]+10] != -1) && !check) ){
			return false;
		}
	}
	return true;
};

tetrisGame.DrawShape = function(shapeType, position, id){//handles drawing the shapes on the screen  
	if(!this.initialized){this.initialize();}

	if(shapeType === 0){//draws the dark blue line shape
		this.currentState[0 + position] = shapeType;
		this.currentState[1 + position] = shapeType;
		this.currentState[2 + position] = shapeType;
		this.currentState[3 + position] = shapeType;
		this.shapeLocation = [0+position, 1+position, 2+position, 3+position];//marks the location of each pixel
	}
	if(shapeType == 1){//draws the orange t shape
		this.currentState[0 + position] = shapeType;
		this.currentState[1 + position] = shapeType;
		this.currentState[2 + position] = shapeType;
		this.currentState[11 + position] = shapeType;
		this.shapeLocation = [0+position, 1+position, 2+position, 11+position];//marks the location of each pixel
	}
	if(shapeType == 2){//draws the light blue z
		this.currentState[0 + position] = shapeType;
		this.currentState[1 + position] = shapeType;
		this.currentState[11 + position] = shapeType;
		this.currentState[12 + position] = shapeType;
		this.shapeLocation = [0+position, 1+position, 11+position, 12+position];//marks the location of each pixel
	}
	if(shapeType == 3){//draws the green backwards z shape
		this.currentState[1 + position] = shapeType;
		this.currentState[2 + position] = shapeType;
		this.currentState[10 + position] = shapeType;
		this.currentState[11 + position] = shapeType;
		this.shapeLocation = [10+position, 11+position, 1+position, 2+position];//marks the location of each pixel
	}
	if(shapeType == 4){//draws the black square
		this.currentState[0 + position] = shapeType;
		this.currentState[1 + position] = shapeType;
		this.currentState[10 + position] = shapeType;
		this.currentState[11 + position] = shapeType;
		this.shapeLocation = [0+position, 1+position, 10+position, 11+position];//marks the location of each pixel
	}
	if(shapeType == 5){//draws the purple l shape
		this.currentState[0 + position] = shapeType;
		this.currentState[10 + position] = shapeType;
		this.currentState[11 + position] = shapeType;
		this.currentState[12 + position] = shapeType;
		this.shapeLocation = [0+position, 10+position, 11+position, 12+position];//marks the location of each pixel
	}
	if(shapeType == 6){//draws the yellow flipped l shape
		this.currentState[0 + position] = shapeType;
		this.currentState[1 + position] = shapeType;
		this.currentState[2 + position] = shapeType;
		this.currentState[10 + position] = shapeType;
		this.shapeLocation = [0+position, 1+position, 2+position, 10+position];//marks the location of each pixel
	}
};

tetrisGame.MoveShape = function(shapeType, index){//called to move the shape down one place
	for(var i = 0; i<4; i++){
		this.currentState[this.shapeLocation[i]] = -1;//erase the shape
	}
	for(var j = 0; j<4; j++){
		this.currentState[this.shapeLocation[j]+index] = shapeType;//redraw the shape
		this.shapeLocation[j] = this.shapeLocation[j]+index;//update the shape location
	}
	return;
};

tetrisGame.isPart = function(index){//function to check if a location in current state is part of the moving shape
	for(var i = 0; i<4; i++){
		if(index == this.shapeLocation[i]){
			return true;
		}
	}
	return false;
};

tetrisGame.Rotate = function(shapetype){//rotates the shapes
	if(shapetype == 0){//rotates the blue line verticle
		this.currentState[this.shapeLocation[0]] = -1;
		this.shapeLocation[0] = this.shapeLocation[0] - 9;
		this.currentState[this.shapeLocation[2]] = -1;
		this.shapeLocation[2] = this.shapeLocation[2] + 9;
		this.currentState[this.shapeLocation[3]] = -1;
		this.shapeLocation[3] = this.shapeLocation[3] + 18;
	}
	if(shapetype == 1){//rotates the T upside down
		this.currentState[this.shapeLocation[3]] = -1;
		this.shapeLocation[3] = this.shapeLocation[3] - 20;
	}
	if(shapetype == 6){//rotates the yellow L upsside down
		this.currentState[this.shapeLocation[3]] = -1;
		this.shapeLocation[3] = this.shapeLocation[3] - 18;
	}

};

tetrisGame.deleteRow = function(){ //function that checks for full rows to clear
	var total = 0;
	for(var i = 0; i<20; i++){
		var j = 0;
		while(this.currentState[(i*10)+j] != -1 && j < 10){
			total += 1;
			j++;
		}
		if(total == 10){
			for(var k = (i*10)+9; k>9; k--){
				this.currentState[k] = this.currentState[k-10];
			}
			for(var l = 0; l < 10; l++){
				this.currentState[l] = -1;
			}
			this.points += 1;
			AddToConsole("Point Awarded! Your Score is: " + this.points);
		}
		total = 0;
	}
};

tetrisGame.changePosition = function(position){//tells the blocks how far to move left or right
	var move = 0;
	var shapeTargetLocation = this.target %10;
	if(this.currentState[this.shapeLocation[0]] == 0){//checks where to place the shape and what rotation 
		if(shapeTargetLocation < 3)
		{
			this.Rotate(0);
		}
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation < 3){
				move = shapeTargetLocation-position - 1;
			}
			else{move = shapeTargetLocation - position-1;}
		}
		else{
			move = shapeTargetLocation-position-3;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 1){//checks where to place the shape and what rotation
		this.Rotate(1);
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>2){
				move = shapeTargetLocation-position-2;
			}
			else{move = 0-position;}
		}
		else{
			move = shapeTargetLocation-position-2;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 2){//checks where to place the shape and what rotation
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>=2){
				move = shapeTargetLocation-position-2;
			}
			else{move = 0-position;}
		}
		else{
			move = shapeTargetLocation-position-2;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 3){//checks where to place the shape and what rotation
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>2){
				move = shapeTargetLocation-position ;
			}
			else if(shapeTargetLocation < 3){
				move = shapeTargetLocation-position;
			}
			else{move = 0-position;}
		}
		else{
			move = shapeTargetLocation-position-1;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 4){//checks where to place the shape and what rotation
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>1){
				move = shapeTargetLocation-position-1;
			}
			else{move = 0-position;}
		}
		else{
			move = shapeTargetLocation-position-1;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 5){//checks where to place the shape and what rotation
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>2){
				move = shapeTargetLocation-position-2;
			}
			else{move = 1-position;}
		}
		else{
			move = shapeTargetLocation-position-2;
		}
	}
	else if(this.currentState[this.shapeLocation[0]] == 6){//checks where to place the shape and what rotation
		this.Rotate(6);
		if(shapeTargetLocation-position<=0){
			if(shapeTargetLocation>2){
				move = shapeTargetLocation-position-2;
			}
			else{move = 0-position;}
		}
		else{
			move = shapeTargetLocation-position-2;
		}
	}
	return move;
};

tetrisGame.Analyze = function(shapetype){//determines where to place shape dependant upon the best possibility
	var found = false;
	var i = 199;
	if(shapetype == 4)//places the sqaure
	{
		while(!found && this.i > 19){
			if(this.currentState[this.i] == -1 && this.currentState[this.i - 1] == -1){//checks right and left
				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-11] == -1 && this.currentState[this.i-30] == -1)//checks around the shape
				{
					this.target = this.i;
					found = true;
				}
			}
			this.i--;
		}
		return;
	}
	if(shapetype == 3)//places the backwards z
	{
		while(!found && this.i > 19){
			if((this.i)%10 != 9){
			if(this.currentState[this.i] == -1 && this.currentState[this.i - 1] == -1 && (this.i - 2)%10 !=9){//checks right and left and if its by the wall
				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-11] == -1 && this.currentState[this.i-9] == -1 && this.currentState[this.i-30] == -1)//checks around the shape
				{
					this.target = this.i;
					found = true;
				}
			}
			}
			this.i--;

		}
		return;
	}
	if(shapetype == 2)//places the light blue z
	{
		while(!found && this.i > 19){
			if(this.currentState[this.i] == -1 && this.currentState[this.i - 1] == -1 && (this.i + 1)%10 !=9){//checks right and left and if its by the wall
				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-11] == -1 && this.currentState[this.i-30] == -1)
				//checks around the shape
				{
					this.target = this.i;
					found = true;
				}
			}
			this.i--;
		}
		return;
	}
	if(shapetype == 0)//places the straight line
	{
		while(!found && this.i > 19){
			if(this.currentState[this.i] == -1 && (this.i%10 == 0 || this.i%10 == 9)){//checks right and left and if its by the wall
				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-40] == -1 && this.currentState[this.i-30] == -1)
				//checks around the shape
				{
					this.target = this.i;
					found = true;

				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-40] == -1 && this.currentState[this.i-30] == -1){

				}
				}
			}
			this.i--;
		}
		return;
	}
	if(shapetype == 1 || 5 || 6)//each shape is looking for 3 open spaces
	{
		while(!found && this.i > 19){

			if(this.currentState[this.i] == -1 && this.currentState[this.i - 1] == -1 && this.currentState[this.i - 2] == -1 && (this.i - 2)%10 !=9){
				if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-11] == -1 && this.currentState[this.i-30] == -1){
					this.target = this.i ;
					found = true;
				}
			}
			this.i--;
		}
		return;
	}
	while(!found && this.i > 19){
		if(this.currentState[this.i] == -1){
			if(this.currentState[this.i-10] == -1 && this.currentState[this.i-20] == -1 && this.currentState[this.i-11] == -1 && this.currentState[this.i-30] == -1){
			this.target = this.i;
			found = true;
			}
		}
		this.i--;
	}
};
