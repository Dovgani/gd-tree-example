import { Folder            } from '../model/folder';
import { Solution          } from '../model/solution';
import { SolutionViewModel } from './solutionViewModel';

export class FolderViewModel
{
    protected model    : Folder;
    private   children : any[];

    get ID()           : string    { return this.model.id;              }
    set ID( id         : string )  {        this.model.id = id;         }

    get Name()         : string    { return this.model.name;            }
    set Name( n        : string )  {        this.model.name = n;        }

    get Type()         : string    { return this.model.type;            }
    set Type( t        : string )  {        this.model.type = t;        }

    get Description()  : string    { return this.model.description;     }
    set Description( d : string )  {        this.model.description = d; }

    get Children()     : any[]     { return this.children;              }

    constructor( model : Folder )
    {
        this.model             = model;
        this.model.type        = 'folder';
        this.model.description = '';
        this.children          = new Array<any>();
    }

    public AddRegion( id : string, name : string, description : string )
    {
        const model = new Folder( id, name, description, 'folder', this.model.parentID );
        this.children.push( new FolderViewModel(model) );
    }

    public AddSolution( id : string, name : string, description : string )
    {
        const model = new Solution( id, name, description, 'solution', null, this.model.id );
        this.children.push( new SolutionViewModel(model) );
    }

    public Delete( id : string )
    {
        const i = this.children.findIndex( (g :FolderViewModel) => g.ID === id );
        this.children.slice( i, 1 );
    }

    public GetByID( id : string )
    {
        return this.children.find( (g :FolderViewModel) => g.ID === id );
    }

    public GetByName( name : string )
    {
        return this.children.find( (g :FolderViewModel) => g.Name === name );
    }
}
