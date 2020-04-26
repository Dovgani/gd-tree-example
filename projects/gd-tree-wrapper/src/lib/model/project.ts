import { State } from 'gd-common';

export class Project
{
    id          : string;
    name        : string;
    description : string;
    type        : string;
    parentID    : string;
    state       : State;

    constructor( id           : string,
                 name         : string,
                 description  : string,
                 type         : string,
                 parentID     : string )
    {
        this.id          = id;
        this.name        = name;
        this.description = description;
        this.type        = type;
        this.parentID    = parentID;
        this.state       = State.unchanged;
    }
}