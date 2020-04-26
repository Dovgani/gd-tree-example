import { BrowserModule       } from '@angular/platform-browser';
import { NgModule            } from '@angular/core';
import { FormsModule         } from '@angular/forms';
import { HttpClientModule    } from '@angular/common/http';
import { AppComponent        } from './app.component';
import { GDTreeWrapperModule } from 'gd-tree-wrapper';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,

    GDTreeWrapperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
