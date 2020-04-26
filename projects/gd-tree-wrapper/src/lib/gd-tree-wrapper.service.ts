import { Injectable      } from '@angular/core';
import { HttpClient      } from '@angular/common/http';
import { HttpHeaders     } from '@angular/common/http';
import { Observable, of  } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Guid            } from 'gd-common';

@Injectable({
  providedIn: 'root'
})
export class GDTreeWrapperService 
{
    private localUrl    = 'http://localhost:64598/api/';
    //private remoteUrl   = 'http://dc04vsprwvsi01.eu.ad.rgis.com/StorPlanner/api/';
    private url         = this.localUrl;

    private businessUrl = this.url + 'DataTree/';

    private httpOptions = 
    {        
        headers : new HttpHeaders( { 'Content-Type' : 'application/json' } )
    };

    constructor( private http : HttpClient ) 
    { 
    }

    public  getChildren     ( id : string, type : string ) : Observable<Node>
    {
        return this.http.get<Node> ( this.businessUrl + 'GetProjectRoot?id=' + id + '&type=' + type )
                        .pipe(
                            catchError( this.handleError<Node>('GetProjectRoot') )
                        );
    }

    public  serachByID      ( id : string ) : Observable<Node>
    {
        return this.http.get<Node>( this.businessUrl + 'FindByID?id=' + id )
                        .pipe(
                            catchError( this.handleError<Node>('FindByID') )
                        );
    }

    public  serachByName    ( str : string, projectID : string ) : Observable<Node>
    {
        return this.http.get<Node>( this.businessUrl + 'FindByName?str=' + str + '&projectID=' + Guid.Empty() )
                        .pipe(
                            catchError( this.handleError<Node>('FindByName') )
                        );
    }

    public  updateFolder    ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'UpdateFolder?id=' + id, JSON.stringify(data), this.httpOptions )
                         .pipe( 
                            catchError( this.handleError<any>('UpdateFolder') )                            
                        );
    }

    public  addFolder       ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'AddFolder?id=' + id, JSON.stringify(data), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('updateSettings') )                            
                        );
    }

    public  deleteFolder    ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'DeleteFolder', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('updateSettings') )                            
                        );
    }

    public  updateSolution  ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'UpdateSolution?id=' + id, JSON.stringify(data), this.httpOptions )
                         .pipe( 
                            catchError( this.handleError<any>('UpdateSolution') )                            
                        );
    }

    public  addSolution     ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'AddSolution?id=' + id, JSON.stringify(data), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('AddSolution') )                            
                        );
    }

    public  deleteSolution  ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'DeleteSolution', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('DeleteSolution') )                            
                        );
    }

    public  lockSolution    ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'LockSolution', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('LockSolution') )                            
                        );
    }
    
    public  unlockSolution  ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'UnlockSolution', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('UnlockSolution') )                            
                        );
    }

    public  checkInSolution ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'CheckInSolution', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('CheckInSolution') )                            
                        );
    }

    public  checkOutSolution( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'CheckOutSolution', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('CheckOutSolution') )                            
                        );
    }

    public  updateProject   ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'UpdateProject?id=' + id, JSON.stringify(data), this.httpOptions )
                         .pipe( 
                            catchError( this.handleError<any>('UpdateProject') )                            
                        );
    }

    public  addProject      ( id : string, data : any ) : Observable<string>
    {
        return this.http.post( this.businessUrl + 'AddProject?id=' + id, JSON.stringify(data), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('AddProject') )                            
                        );
    }

    public  deleteProject   ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'DeleteProject', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('DeleteProject') )                            
                        );
    }

    public  lockProject     ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'LockProject', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('DeleteProject') )                            
                        );
    }

    public  unlockProject   ( id : string ) : Observable<string>
    {
        var ids = new Array<string>();
            ids.push(id);

        return this.http.post( this.businessUrl + 'UnlockProject', JSON.stringify(ids), this.httpOptions )
                        .pipe( 
                            catchError( this.handleError<any>('DeleteProject') )                            
                        );
    }

    private handleError<T>( operation = 'operation', result?: T ) 
    {
        return (error: any): Observable<T> => 
        {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
        
            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);
        
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    } 
}
