import { Component} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent  {
  public startGame:boolean = false;
  public hero1Name:any ;
  public hero2Name:any ;
  public onClickSubmit(data){
    this.startGame=true;
  }
}
