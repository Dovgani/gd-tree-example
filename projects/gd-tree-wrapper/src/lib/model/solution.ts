import { State } from 'gd-common';

export class Solution
{
    id              : string;
    name            : string;
    description     : string;
    type            : string;
    activeProjectID : string;
    isActive        : boolean;
    isLocked        : boolean;
    checkoutBy      : number;
    checkoutDate    : Date;
    children        : any[];
    parentID        : string;
    state           : State;

    constructor( id             : string,
                 name           : string,
                 description    : string,
                 type           : string,
                 activeProjectID: string,
                 parentID       : string )
    {
        this.id              = id;
        this.name            = name;
        this.description     = description;
        this.type            = type;
        this.activeProjectID = activeProjectID;
        this.parentID        = parentID;
        this.state           = State.unchanged;
        this.children        = new Array<any>();
    }
}