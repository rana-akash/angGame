import { Component,ViewChild, Input,OnChanges,OnInit,AfterViewInit,DoCheck,OnDestroy,AfterContentInit,AfterContentChecked} from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls:['./score.component.css']
})
export class ScoreComponent implements OnChanges,OnInit,AfterViewInit,DoCheck,OnDestroy,AfterContentInit,AfterContentChecked {
  @Input() hero1Score;
  @Input() hero2Score;
  someClass = 'container night';
  ngOnChanges(){

    //console.log("environment ngOnChanges!");
    if(this.someClass == "container night"){
      this.someClass = "container"
    }else if(this.someClass == "container"){
      this.someClass = "container night"
    }
    document.getElementById("infoBox").innerHTML="<h3>ngOnChangesEnvironMent HIT!!</h3>";
    setTimeout(() => {
      document.getElementById("infoBox").innerHTML="";
    }, 200);
  }
  ngOnInit(){
   //console.log("environment Initialized");

  }
  ngDoCheck(){
    //console.log("ngDoCheck");
    //document.body.style.background =this.randomcolor();
  }
  ngOnDestroy(){
    console.log("ngOnDestroy!!!!!!!!!!!!!!!!");
  }
  randomcolor(): string {
    let colorArray = ['red','grey','blue','green','brown'];
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }
  ngAfterContentInit(){
    //console.log("ngAfterContentInit");
  }
  ngAfterContentChecked(){
    //console.log("ngAfterContentChecked");
  }
  ngAfterViewInit(){
    //console.log("ngAfterViewInit...........................................");
  }

}
