export class Folder
{
    id          : string;
    name        : string;
    description : string;
    type        : string;
    parentID    : string;

    constructor( id          : string,
                 name        : string,
                 description : string,
                 type        : string,
                 parentID    : string )
    {
        this.id          = id;
        this.name        = name;
        this.description = description;
        this.type        = type;
        this.parentID    = parentID;
    }
}