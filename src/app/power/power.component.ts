import { Component, Input } from '@angular/core';

@Component({
  selector: 'power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.css']
})
export class PowerComponent  {
@Input() hero1PowerLeft;
@Input() hero2PowerLeft;
@Input() hero1LifeLeft;
@Input() hero2LifeLeft;


}
