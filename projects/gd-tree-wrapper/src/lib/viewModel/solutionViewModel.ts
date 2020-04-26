import { State    } from 'gd-common';
import { Solution } from '../model/solution';

export class SolutionViewModel
{
    protected model      : Solution;
    private   children   : any[];
    private   isActive   : boolean;

    get ID()           : string    { return this.model.id;               }
    set ID( id         : string )  {        this.model.id = id;          }

    get Name()         : string    { return this.model.name;             }
    set Name( n        : string )  {        this.model.name = n;         }

    get Description()  : string    { return this.model.description;      }
    set Description( d : string )  {        this.model.description = d;  }

    get IsActive()     : boolean   { return this.isActive;               }
    set IsActive( b    : boolean ) {        this.isActive = b;           }

    get IsLocked()     : boolean   { return this.model.isLocked;         }
    set IsLocked( b    : boolean ) {        this.model.isLocked = b;     }

    get Type()         : string    { return this.model.type;             }
    set Type( b        : string  ) {        this.model.type = b;         }

    get CheckoutBy()   : number    { return this.model.checkoutBy;       }
    set CheckoutBy( id : number )  {        this.model.checkoutBy = id;  }

    get CheckoutDate()  : Date     { return this.model.checkoutDate;     }
    set CheckoutDate( d : Date )   {        this.model.checkoutDate = d; }

    get State()        : State     { return this.model.state;            }
    set State( s       : State )   {        this.model.state = s;        }

    get Children()     : any[]     { return this.children;               }

    constructor( model : Solution )
    {
        this.model    = model;
        this.children = new Array<any>();
    }

    public Add( id : string, name : string, description : string, parentID : string )
    {
        const model = new Solution( id, name, description, 'plan', null, parentID );
        this.children.push( new SolutionViewModel(model) );
    }

    public Delete( id : string )
    {
        const i = this.children.findIndex( (g : SolutionViewModel) => g.ID === id );
        this.children.slice( i, 1 );
    }

    public GetByID( id : string )
    {
        return this.children.find( (g :SolutionViewModel) => g.ID === id );
    }

    public GetByName( name : string )
    {
        return this.children.find( (g :SolutionViewModel) => g.Name === name );
    }
}
