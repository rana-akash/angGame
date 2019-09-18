import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BestScoreManager } from './app.storage.service';
import { PowerComponent } from './power/power.component';
import { MenuComponent } from './menu/menu.component';
import { ScoreComponent } from './score/score.component';
import { AnimateComponent } from './animate/animate.component';

@NgModule({
  declarations: [
    AppComponent,
    PowerComponent,
    MenuComponent,
    ScoreComponent,
    AnimateComponent
  ],
  imports: [
    BrowserModule,FormsModule
  ],
  providers: [
    BestScoreManager
  ],
  bootstrap: [
    MenuComponent
  ]
})
export class AppModule { }
