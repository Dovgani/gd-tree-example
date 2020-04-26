import { State               } from 'gd-common';
import { Project             } from '../model/project';

export class ProjectViewModel
{
    protected model    : Project;
    private   children : any[];
    private   isActive : boolean;

    get ID()           : string    { return this.model.id;              }
    set ID( id         : string )  {        this.model.id = id;         }

    get Name()         : string    { return this.model.name;            }
    set Name( n        : string )  {        this.model.name = n;        }

    get Description()  : string    { return this.model.description;     }
    set Description( d : string )  {        this.model.description = d; }

    get Type()         : string    { return this.model.type;            }
    set Type( b        : string  ) {        this.model.type = b;        }

    get IsActive()     : boolean   { return this.isActive;              }
    set IsActive( a    : boolean ) {        this.isActive = a;          }

    get State()        : State     { return this.model.state;           }
    set State( s       : State )   {        this.model.state = s;       }

    get Children()     : any[]     { return this.children;              }

    constructor( model : Project )
    {
        this.model    = model;
        this.children = new Array<any>();
    }

    public GetGondolaByID( id : string )
    {
        return this.children.find( i => i.ID === id );
    }
}
