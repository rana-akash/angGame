import { Component, Input,OnInit } from '@angular/core';
import { BestScoreManager } from './app.storage.service';
import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES,CONTROLSOPPONENT } from './app.constants';
import { constants } from 'os';
declare var $: any;


@Component({
  selector: 'ngx-snake',
  templateUrl: './app.component.html',
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})

export class AppComponent implements OnInit {
  public candies = [{
    x:-1,y:-1
  }]
  public color = "red";
  @Input() public hero1Name:string;
  @Input() public hero2Name:string;
  public posChanged = false;
  public hero1CandyCount=0;
  public hero2CandyCount=0;
  public hero1Score:number=0;
  public hero2Score:number=0;
  public gameStarted:boolean = false;
  public hero1Won:boolean = false;
  public hero2Won:boolean = false;
  public hero1Life:number;
  public hero2Life:number;
  public hero1PowerLimit:number;
  public hero2PowerLimit:number;
  public hero1Power:number;
  public hero2Power:number;
  public interval: number=120;
  public hero1Direction: number;
  public hero2Direction: number;
  public isHero1Won:boolean = false;
  public isHero2Won:boolean = false;
  public board = [];
  public isGameOver = false;
  public obstacles = [];
  public hero1 = {x:-1,y:-1};
  public hero2 = {x:-1,y:-1};
  public isBelowLine = false;
  public didCollide = false;
  public movingObstacle1 = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  public movingObstacle2 = {
    direction: CONTROLS.RIGHT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };
  public movingObstacle3 = {
    direction: CONTROLS.RIGHT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  constructor() {
    this.setBoard();
  }
  ngOnInit(){
    /*
    $(document).ready(function(){
      $("#btn1").click(function(){
        alert('start game clicked!');
      });
    });
    */
    $(function() {
      $( "#dialog-1" ).dialog({
         autoOpen: true,
         modal: true,
         resizable: true,
         buttons: {
          OK: function() {$(this).dialog("close");}
       }
      });

      $( "#dialog-1" ).dialog( "open" );

   });

  }

  panicMode():void{
    if(this.isBelowLine || this.isGameOver){document.body.style.background ='white';return;}
    if(!this.isGameOver){
      document.body.style.background = this.randomcolor();
    }
    setTimeout(() => {
      this.panicMode();
    }, 300);
  }

  panic():void{
    if(this.didCollide){
        document.body.style.background = this.randomcolor();
    }
    else{
      document.body.style.background = "white";
    }

  }

  /*1,2,3,4,5,8,10,11,12,14,16,17*/
  addCandy():void{

    for(let i=0;i<BOARD_SIZE;i++){
      if(!(i==1  || i==0 || i==2 || i==3  ||i==5 ||i==7 ||i==8 ||i==10 ||i==11 ||i==14 ||i==12 ||i==16 ||i==17 )){
        for(let j=0;j<2;j++){
          let temp = 0;
          while(temp==3 || temp==14 || this.checkCandy(temp,i)){temp = this.randomNumber();}
          this.candies.push({y:i,x:temp});
        }
      }
    }
  //  debugger
  }
  addStaticObstacles(): void {
    for (let j =0;j<BOARD_SIZE;j++){
      if(j==10 ||j==16 ||j==1 ||j==5 ||j==12||j==3||j==14||j==7){
        for(let i =0;i<BOARD_SIZE;i++){
          if(i!=this.randomNumber() && i!=this.randomNumber() && i!=this.randomNumber() && i!=this.randomNumber() && i!=this.randomNumber() && i!=this.randomNumber())
            this.obstacles.push({
              y: j,
              x: i
            });
        }
      }
    }
  }

  boardCollision(part: any): boolean {
    return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
  }
  checkMovingObstacle(x,y):boolean{
    if(this.board[x][y]==true){
      return true;
    }
    return false;
  }
  checkObstacles(x, y): boolean {
    let res = false;

    this.obstacles.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }
  checkCandy(x, y): boolean {
    let res = false;

    this.candies.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }
  updatePositions():void{
    this.didCollide=false;
    if(this.hero1.x==0 &&((this.hero1Score+40)>this.hero2Score)){
      console.log("hero1 won!!");
      this.hero1Won=true;
      this.isGameOver=true;
      return;
    }else if(this.hero2.x==0 &&((this.hero2Score+40)>this.hero1Score)){
      console.log("hero2 won!!");
      this.hero2Won=true;
      this.isGameOver=true;
      return;
    }

    if(this.hero1Power!=null && this.hero1PowerLimit!=0){
      this.hero1PowerLimit-=1;
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.x=17;
      this.hero2.y=3;
      this.board[this.hero2.x][this.hero2.y]="hero2";
      this.hero1Power = null;
      this.updatePositions();
    }
    if(this.hero2Power!=null && this.hero2PowerLimit!=0){
      this.hero2PowerLimit-=1;
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.x=17;
      this.hero1.y=8;
      this.board[this.hero1.x][this.hero1.y]="hero1";
      this.hero2Power = null;
      this.updatePositions();
    }

    let newHead1 = this.repositionObstacleHead("Left");
    this.noWallsTransition(newHead1);
    let oldTail1 = this.movingObstacle1.parts.pop();
    this.board[oldTail1.y][oldTail1.x] = false;
    this.movingObstacle1.parts.unshift(newHead1);
    this.board[newHead1.y][newHead1.x] = true;
    /* DownRight */
    let newHead2 = this.repositionObstacleHead("Right2");
    this.noWallsTransition(newHead2);
    let oldTail2 = this.movingObstacle2.parts.pop();
    this.board[oldTail2.y][oldTail2.x] = false;
    this.movingObstacle2.parts.unshift(newHead2);
    this.board[newHead2.y][newHead2.x] = true;

    let newHead3 = this.repositionObstacleHead("Right3");
    this.noWallsTransition(newHead3);
    let oldTail3 = this.movingObstacle3.parts.pop();
    this.board[oldTail3.y][oldTail3.x] = false;
    this.movingObstacle3.parts.unshift(newHead3);
    this.board[newHead3.y][newHead3.x] = true;

    let isObstacleHero1:boolean = false;
    let isObstacleHero2:boolean = false;

    /*hero2Directions*/
    /*
    if (this.hero2Direction === CONTROLSOPPONENT.LEFT && this.hero2.y-1!=-1 ) {
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.y -= 1;
      if(this.board[this.hero2.x][this.hero2.y]==true){
        isObstacleHero2=true;
      }
      if(!isObstacleHero2){
        this.board[this.hero2.x][this.hero2.y]="hero2";
      }

    }else if (this.hero2Direction === CONTROLSOPPONENT.RIGHT && this.hero2.y+1!=BOARD_SIZE) {
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.y += 1;
      if(this.board[this.hero2.x][this.hero2.y]==true){
        isObstacleHero2=true;
      }
      if(!isObstacleHero2){
        this.board[this.hero2.x][this.hero2.y]="hero2";
      }
    } else if (this.hero2Direction === CONTROLSOPPONENT.UP && this.hero2.x-1!=-1) {
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.x -= 1;
      if(this.board[this.hero2.x][this.hero2.y]==true){
        isObstacleHero2=true;
      }
      if(!isObstacleHero2){
        this.board[this.hero2.x][this.hero2.y]="hero2";
      }
    } else if (this.hero2Direction === CONTROLSOPPONENT.DOWN && this.hero2.x+1!=BOARD_SIZE) {
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.x += 1;
      if(this.board[this.hero2.x][this.hero2.y]==true){
        isObstacleHero2=true;
      }
      if(!isObstacleHero2){
        this.board[this.hero2.x][this.hero2.y]="hero2";
      }
    }
    if(this.checkObstacles(this.hero2.y,this.hero2.x)||isObstacleHero2||(newHead2.y==this.hero2.x && newHead2.x==this.hero2.y)||(newHead1.y==this.hero2.x && newHead1.x==this.hero2.y)||(newHead3.y==this.hero2.x && newHead3.x==this.hero2.y)){
      console.log("ON Obstacle!!");
      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.x=17;
      this.hero2.y=3;
      this.board[this.hero2.x][this.hero2.y]="hero2";
      this.hero2Life-=1;
      console.log("hero2Life: "+this.hero2Life);
      if(this.hero2Life==-1){
        this.board[this.hero2.x][this.hero2.y]=false;
        console.log("hero1 won!!");
        this.hero1Won = true;
        this.isGameOver=true;
      }
    }


    hero1Directions*/


    if (this.hero1Direction === CONTROLS.LEFT && this.hero1.y-1!=-1 ) {
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.y -= 1;

      if(this.board[this.hero1.x][this.hero1.y]==true){
        isObstacleHero1=true;
      }
      if(!isObstacleHero1){
        this.posChanged = !this.posChanged;
        this.board[this.hero1.x][this.hero1.y]="hero1";
      }

    } else if (this.hero1Direction === CONTROLS.RIGHT && this.hero1.y+1!=BOARD_SIZE) {
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.y += 1;

      if(this.board[this.hero1.x][this.hero1.y]==true){
        isObstacleHero1=true;
      }
      if(!isObstacleHero1){
        this.posChanged = !this.posChanged;
        this.board[this.hero1.x][this.hero1.y]="hero1";
      }
    } else if (this.hero1Direction === CONTROLS.UP && this.hero1.x-1!=-1) {
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.x -= 1;

      if(this.board[this.hero1.x][this.hero1.y]==true){
        isObstacleHero1=true;
      }
      if(!isObstacleHero1){
        this.posChanged = !this.posChanged;
        this.board[this.hero1.x][this.hero1.y]="hero1";
      }
    } else if (this.hero1Direction === CONTROLS.DOWN && this.hero1.x+1!=BOARD_SIZE) {
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.x += 1;

      if(this.board[this.hero1.x][this.hero1.y]==true){
        isObstacleHero1=true;
      }
      if(!isObstacleHero1){
        this.posChanged = !this.posChanged;
        this.board[this.hero1.x][this.hero1.y]="hero1";
      }
    }


    if(this.checkObstacles(this.hero1.y,this.hero1.x)||isObstacleHero1||(newHead2.y==this.hero1.x && newHead2.x==this.hero1.y)||(newHead1.y==this.hero1.x && newHead1.x==this.hero1.y)||(newHead3.y==this.hero1.x && newHead3.x==this.hero1.y)){
      //console.log("ON Obstacle!!");
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.x=17;
      this.hero1.y=8;
      this.board[this.hero1.x][this.hero1.y]="hero1";
      this.hero1Life-=1;
      //console.log("hero1Life: "+this.hero1Life);
      if(this.hero1Life==-1){
        this.board[this.hero1.x][this.hero1.y]=false;
        console.log("hero2 won!!");
        this.hero2Won = true;
        this.isGameOver=true;
      }
    }
/*
    if(this.hero1.x==this.hero2.x && this.hero1.y==this.hero2.y){
      this.didCollide=true;
      console.log("crashed!!");
      //this.panic();
      this.board[this.hero1.x][this.hero1.y]=false;
      this.hero1.x=17;
      this.hero1.y=8;
      this.board[this.hero1.x][this.hero1.y]="hero1";

      this.board[this.hero2.x][this.hero2.y]=false;
      this.hero2.x=17;
      this.hero2.y=3;
      this.board[this.hero2.x][this.hero2.y]="hero2";
    }
    if(this.hero1.x>8 || this.hero2.x>8 ){
      this.isBelowLine=true;
    }*/
    /*
    if(this.hero1.x<=8 || this.hero2.x<=8 ){
      this.isBelowLine=false;
      this.panicMode();
    }*/
    if(this.checkCandy(this.hero1.y,this.hero1.x)){
      this.hero1CandyCount+=1;
      this.destroyCandy(this.hero1.y,this.hero1.x);
      this.hero1Score+=20;
      console.log('candy Hit: '+this.hero1CandyCount);
    }
    if(this.checkCandy(this.hero2.y,this.hero2.x)){
      this.hero2CandyCount+=1;
      this.destroyCandy(this.hero2.y,this.hero2.x);
      this.hero2Score+=20;
      console.log(this.hero2CandyCount);
    }


    this.hero1Direction=null;
    this.hero2Direction=null;

    setTimeout(() => {
      this.updatePositions();
    }, this.interval);
  }
  destroyCandy(x,y):void{

    this.candies.forEach((val) => {
      if (val.x === x && val.y === y) {
        val.x=-1;val.y=-1;
        return;
      }
    });
  }

  noWallsTransition(part: any): void {

    if (part.x === BOARD_SIZE) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_SIZE - 1;
    }

  }


  repositionObstacleHead(dirctn:string):any{
    if(dirctn=="Left"){
      let newHead = Object.assign({}, this.movingObstacle1.parts[0]);
      newHead.x -= 1;
      return newHead;
    }
    if(dirctn=="Right2"){
      let newHead = Object.assign({}, this.movingObstacle2.parts[0]);
      newHead.x += 1;
      return newHead;
    }
    if(dirctn=="Right3"){
      let newHead = Object.assign({}, this.movingObstacle3.parts[0]);
      newHead.x += 1;
      return newHead;
    }
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
  }
  randomcolor(): string {
    let colorArray = ['red','grey','blue','green','brown'];
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }

  newGame():void{
   // console.log("inside newGame()");







    this.gameStarted = true;
    this.hero1PowerLimit=2;
    this.hero2PowerLimit=2;
    this.hero1Life = 2;
    this.hero2Life = 2;
    this.hero1.x = 17;
    this.hero1.y = 8;
    this.hero2.x = 17;
    this.hero2.y = 3;
    this.board[this.hero1.x][this.hero1.y]="hero1";
    this.board[this.hero2.x][this.hero2.y]="hero2";
    this.addStaticObstacles();
    this.addCandy();
    this.movingObstacle1 = {
      direction: CONTROLS.LEFT,
      parts: []
    };
    for (let i = 0; i < 5; i++) {
      this.movingObstacle1.parts.push({ x: 8 + i, y: 8 });
    }
    this.movingObstacle2 = {
      direction: CONTROLS.RIGHT,
      parts: []
    };
    for (let i = 0; i < 5; i++) {
      this.movingObstacle2.parts.push({ x: 8 + i, y: 11 });
    }
    this.movingObstacle3 = {
      direction: CONTROLS.RIGHT,
      parts: []
    };
    for (let i = 0; i < 5; i++) {
      this.movingObstacle3.parts.push({ x: 8 + i, y: 2 });
    }
    this.updatePositions();

  }

  setBoard(): void {
    this.board = [];
    for (let i = 0; i < BOARD_SIZE ; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }
  setColors(col: number, row: number): string {
    if (this.isGameOver) {
      return COLORS.GAME_OVER;
    }
    else if (this.board[col][row] === true) {
      return COLORS.FRUIT;
    }
    else if (this.board[col][row]==="hero1") {
      return COLORS.BODY;
    }
    else if (this.board[col][row]==="hero22") {
      return COLORS.HERO2;
    }
    else if (this.checkObstacles(row, col)) {
      return COLORS.OBSTACLE;
    }
    else if (this.checkCandy(row, col)) {
      return COLORS.CANDY;
    }
    return COLORS.BOARD;
  }


handleKeyboardEvents(e: KeyboardEvent){

  if (e.keyCode === CONTROLS.LEFT ) {
    this.hero1Direction = CONTROLS.LEFT;
  } else if (e.keyCode === CONTROLS.UP ) {
    this.hero1Direction = CONTROLS.UP;
  } else if (e.keyCode === CONTROLS.RIGHT ) {
    this.hero1Direction = CONTROLS.RIGHT;
  } else if (e.keyCode === CONTROLS.DOWN ) {
    this.hero1Direction = CONTROLS.DOWN;
  }
  else if (e.keyCode === CONTROLSOPPONENT.DOWN ) {
    this.hero2Direction = CONTROLSOPPONENT.DOWN;
  }
  else if (e.keyCode === CONTROLSOPPONENT.LEFT ) {
    this.hero2Direction = CONTROLSOPPONENT.LEFT;
  }
  else if (e.keyCode === CONTROLSOPPONENT.RIGHT ) {
    this.hero2Direction = CONTROLSOPPONENT.RIGHT;
  }
  else if (e.keyCode === CONTROLSOPPONENT.UP ) {
    this.hero2Direction = CONTROLSOPPONENT.UP;
  }
  else if (e.keyCode === CONTROLS.POWER ) {
    this.hero1Power = CONTROLS.POWER;
  }
  else if (e.keyCode === CONTROLSOPPONENT.POWER ) {
    this.hero2Power = CONTROLSOPPONENT.POWER;
  }
}
}
