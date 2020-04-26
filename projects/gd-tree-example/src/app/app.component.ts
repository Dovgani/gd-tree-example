import { Component         } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AfterViewInit     } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit 
{
    public constructor( private cdRef : ChangeDetectorRef )
    {
    }

    public ngAfterViewInit(): void
    {
        // disable browser contextmenu
        document.addEventListener( 'contextmenu', (event : any) => event.preventDefault() );   
    }

    public ngAfterViewChecked() 
    {
        this.cdRef.detectChanges();
    }
}
