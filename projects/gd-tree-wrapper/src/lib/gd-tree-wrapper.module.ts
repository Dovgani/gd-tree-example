import { NgModule               } from '@angular/core';
import { BrowserModule          } from '@angular/platform-browser';
import { FormsModule            } from '@angular/forms';

import { GDTreeWrapperComponent } from './gd-tree-wrapper.component';
import { GDTreeModule           } from 'gd-tree';
import { GDContextmenuModule    } from 'gd-contextmenu';
import { GDPGModule             } from 'gd-pg';
import { GDAccordionModule      } from 'gd-accordion';
import { GDTooltipModule        } from 'gd-tooltip';
import { GDWindowModule         } from 'gd-window';

@NgModule({
  declarations: [GDTreeWrapperComponent],
  imports: [
    BrowserModule,
    FormsModule,

    GDTreeModule,
    GDContextmenuModule,
    GDPGModule,
    GDAccordionModule,
    GDTooltipModule,
    GDWindowModule
  ],
  exports: [GDTreeWrapperComponent]
})
export class GDTreeWrapperModule { }
