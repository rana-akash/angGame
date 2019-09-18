import { Component, Input,OnChanges,OnInit} from '@angular/core';

@Component({
  selector: 'app-animate',
  templateUrl: './animate.component.html',
  styleUrls:['./animate.component.css']
})
export class AnimateComponent implements OnChanges,OnInit{
  @Input() positionChange;
  public animationState:string="paused";
  public onInitCalled = false;
  public onChangeCalled = false;
  ngOnChanges(){
    this.onChangeCalled=true;
    document.getElementById("infoBox").innerHTML="<h3>ngOnChanges HIT!!</h3>";
    setTimeout(() => {
      document.getElementById("infoBox").innerHTML="";
    }, 200);
    //console.log("onchange hit");
    if(this.onInitCalled){
      if(this.animationState == "running"){
        this.animationState = "paused";
      }
      else if(this.animationState == "paused"){
        this.animationState = "running";
        setTimeout(() => {
          this.animationState ="paused";
        }, 100);
      }
    }
  }

  ngOnInit(){
    //console.log("ngOnInit hit");
    if(this.onChangeCalled){
      document.getElementById("infoBox").innerHTML="<h3>ngOnInit HIT!!</h3>";
    }
    this.onInitCalled = true;

  }
}
