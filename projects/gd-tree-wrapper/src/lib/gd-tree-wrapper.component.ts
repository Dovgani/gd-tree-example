import { Component              } from '@angular/core';
import { AfterViewInit          } from '@angular/core';
import { ViewChild              } from '@angular/core';
import { ViewEncapsulation      } from '@angular/core';
import { ElementRef             } from '@angular/core';
import { OnDestroy              } from '@angular/core';
import { Renderer2              } from '@angular/core';
import { NgZone                 } from '@angular/core';

import { PGData, IPGData        } from 'gd-common';
import { ITreeOptions           } from 'gd-common';
import { GDCommonService        } from 'gd-common';
import { Message, WindowButtons } from 'gd-common';
import { IPGCategory            } from 'gd-common';
import { Guid                   } from 'gd-common';
import { GDCommonTools          } from 'gd-common';
 
import { GDWindowComponent      } from 'gd-window';
import { GDTreeComponent        } from 'gd-tree';
import { GDTreeService          } from 'gd-tree';
import { GDPGComponent          } from 'gd-pg';
import { GDContextmenuComponent } from 'gd-contextmenu';
import { GDTreeWrapperService   } from './gd-tree-wrapper.service';
import { Folder                 } from './model/folder';
import { Solution               } from './model/solution';
import { Project                } from './model/project';
import { FolderViewModel        } from './viewModel/folderViewModel';
import { SolutionViewModel      } from './viewModel/solutionViewModel';
import { ProjectViewModel       } from './viewModel/projectViewModel';
import { Subscription           } from 'rxjs';

declare var $ : any;

@Component({
  selector:      'gd-tree-wrapper',
  templateUrl: "./gd-tree-wrapper.component.html",
  styleUrls:  ["./gd-tree-wrapper.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class GDTreeWrapperComponent implements AfterViewInit, OnDestroy 
{
    @ViewChild('window')        window        : GDWindowComponent;
    @ViewChild('tree')          tree          : GDTreeComponent;
    @ViewChild('pgWindow')      pgWindow      : GDWindowComponent;
    @ViewChild('pgFolder')      pgFolder      : GDPGComponent;
    @ViewChild('deleteConfirm') deleteConfirm : GDWindowComponent;
    @ViewChild('searchMessage') searchMessage : GDWindowComponent;
    @ViewChild('treeMenu')      treeMenu      : GDContextmenuComponent;

    private errorMessage     : any;
    private treeOptions      : ITreeOptions;
    public  treeAction       = '';
    public  treeMode         = '';
    public  LoadedStore      : any;
    public  LoadedSolution   : any;
    public  LoadedProject    : any;
    public  treeName         : string = 'gd-tree'; 
    private tools            : GDCommonTools;

    public  folderSettings   : Array<IPGCategory>;
    public  solutionSettings : Array<IPGCategory>;
    public  projectSettings  : Array<IPGCategory>;

    public  ShowFolderPG     = false;
    public  ShowSolutionPG   = false;
    public  ShowProjectPG    = false;
    public  dataToEdit       : IPGData;

    //#region Subscriptions
    private subscriptionIsLoaded : Subscription;
    private subscriptionSearch   : Subscription;
    private subscriptionAdded    : Subscription;
    private subscriptionOpened   : Subscription;
    private subscriptionClosed   : Subscription;
    private subscriptionSelected : Subscription;
    private subscriptionHover    : Subscription;
    private subscriptionDehover  : Subscription;

    private subscriptionToParent : Subscription;
    private subscriptionPgSave   : Subscription;
    private subscriptionTooltip  : Subscription;
    //#endregion

    constructor( private el : ElementRef, private zone : NgZone, private renderer : Renderer2, private dataService : GDTreeWrapperService, private commonService : GDCommonService, private treeService : GDTreeService ) 
    { 
        this.subscriptionIsLoaded = treeService.isLoaded$               .subscribe( (data : any     ) => this.onIsLoaded      (data) );
        this.subscriptionSearch   = treeService.nodeSearch$             .subscribe( (data : any     ) => this.onNodeSearch    (data) );
        this.subscriptionAdded    = treeService.nodeAdded$              .subscribe( (data : any     ) => this.onNodeAdded     (data) );
        this.subscriptionOpened   = treeService.nodeOpened$             .subscribe( (data : any     ) => this.onNodeOpened    (data) );
        this.subscriptionClosed   = treeService.nodeClosed$             .subscribe( (data : any     ) => this.onNodeClosed    (data) );
        this.subscriptionSelected = treeService.nodeSelected$           .subscribe( (data : any     ) => this.onNodeSelected  (data) );
        this.subscriptionHover    = treeService.nodeHover$              .subscribe( (data : any     ) => this.onNodeHover     (data) );
        this.subscriptionDehover  = treeService.nodeDehover$            .subscribe( (data : any     ) => this.onNodeDehover   (data) );

        this.subscriptionToParent = commonService.toParent$             .subscribe( (data : Message ) => this.onFromChild     (data) );
        this.subscriptionPgSave   = commonService.pgSave$               .subscribe( (data : any     ) => this.onPGSave        (data) );
        this.subscriptionTooltip  = commonService.tooltipContentRequest$.subscribe( (data : any     ) => this.onTooltipRequest(data) );

        this.tools = new GDCommonTools();

        this.folderSettings = [
            {
                Name: 'Properties',
                isExpanded : true,
                isDisabled : true,
                Properties: [
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : true,
                        name       : 'id',
                        display    : 'ID',
                        type       : 'string',
                        editor     : 'string',
                        value      : null,
                        data       : null,
                        tabStop    : 1,
                    },
                    {
                        categoryName: 'Properties',
                        isCustom    : false,
                        isDisabled  : false,
                        name        : 'name',
                        display     : 'Name',
                        type        : 'string',
                        editor      : 'string',
                        required    : '*',
                        value       : null,
                        data        : null,
                        tabStop     : 2,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : false,
                        name       : 'description',
                        display    : 'Description',
                        type       : 'text',
                        editor     : 'text',
                        value      : '',
                        data       : null,
                        tabStop    : 3,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : true,
                        name       : 'type',
                        display    : 'Type',
                        type       : 'string',
                        editor     : 'combobox',
                        value      : 'folder',
                        data       : [ {id: 1, name: 'folder'}, {id: 2, name: 'solution'}, {id: 3, name: 'project'} ],
                        tabStop    : 4,
                    }
                ]
            }
        ];
        this.solutionSettings = [
            {
                Name: 'Properties',
                isExpanded : true,
                isDisabled : true,
                Properties: [
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : true,
                        name       : 'id',
                        display    : 'ID',
                        type       : 'string',
                        editor     : 'string',
                        value      : null,
                        data       : null,
                        tabStop    : 1,
                    },
                    {
                        categoryName: 'Properties',
                        isCustom    : false,
                        isDisabled  : false,
                        name        : 'name',
                        display     : 'Name',
                        type        : 'string',
                        editor      : 'string',
                        required    : '*',
                        value       : null,
                        data        : null,
                        tabStop     : 2,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : false,
                        name       : 'description',
                        display    : 'Description',
                        type       : 'text',
                        editor     : 'text',
                        value      : '',
                        data       : null,
                        tabStop    : 3,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : false,
                        name       : 'type',
                        display    : 'Type',
                        type       : 'string',
                        editor     : 'combobox',
                        value      : 'type1',
                        data       : [ {id : 1, name : 'type1'}, {id : 2, name : 'type2'}, {id : 3, name : 'type3'} ] ,
                        tabStop    : 4,
                    }
                ]
            }
        ];
        this.projectSettings = [
            {
                Name: 'Properties',
                isExpanded : true,
                isDisabled : true,
                Properties: [
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : true,
                        name       : 'id',
                        display    : 'ID',
                        type       : 'string',
                        editor     : 'string',
                        value      : null,
                        data       : null,
                        tabStop    : 1,
                    },
                    {
                        categoryName: 'Properties',
                        isCustom    : false,
                        isDisabled  : false,
                        name        : 'name',
                        display     : 'Name',
                        type        : 'string',
                        editor      : 'string',
                        required    : '*',
                        value       : null,
                        data        : null,
                        tabStop     : 2,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : false,
                        name       : 'description',
                        display    : 'Description',
                        type       : 'text',
                        editor     : 'text',
                        value      : '',
                        data       : null,
                        tabStop    : 3,
                    },
                    {
                        categoryName  : 'Properties',
                        isCustom   : false,
                        isDisabled : true,
                        name       : 'type',
                        display    : 'Type',
                        type       : 'string',
                        editor     : 'combobox',
                        value      : 'project',
                        data       : [ {id: 1, name: 'folder'}, {id: 2, name: 'solution'}, {id: 3, name: 'project'} ],
                        tabStop    : 4,
                    }
                ]
            }
        ];
    }

    public  ngAfterViewInit(): void 
    {
        this.treeOptions =
        {
            core :
            {
                'animation'      : 0,
                'themes'         :
                {
                    'theme'   : { 'name' : 'default', 'responsive': true },
                    'stripes' : false,
                    'dots'    : false,
                    'icons'   : true
                },
                // 'check_callback' : true, // allow all operations
                'check_callback' : function( operation: any, node: any, node_parent: any, node_position: any, more: any )
                {
                    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                    // in case of 'rename_node' node_position is filled with the new node name

                    if( operation === 'move_node' )
                    {
                    }

                    return true;
                },

                'data' : (node: any, cb: any) => { this.getChildren( node, cb ); }
            },
            dnd :
            {
                check_while_dragging : true,
                is_draggable         : (node : any) =>
                {
                    return false;
                }
            },
            types :
            {
                '#'                 : { 'valid_children' : ['root',     'folder'             ], 'max_children' : -1, 'max_depth' : -1                    },
                'folder'            : { 'valid_children' : ['folder',   'solution-type1', 
                                                                        'solution-type2', 
                                                                        'solution-type3', 
                                                                        'solution-checkout',  
                                                                        'solution-locked'    ], 'icon': 'assets/ribbon/icons/hot/Folder-closed.gif'      },
                'solution-type1'    : { 'valid_children' : ['project',  'project-locked'     ], 'icon': 'assets/ribbon/icons/hot/Solution-Planogram.png' },
                'solution-type2'    : { 'valid_children' : ['project',  'project-locked'     ], 'icon': 'assets/ribbon/icons/hot/Solution-Realgram.png'  },
                'solution-type3'    : { 'valid_children' : ['project',  'project-locked'     ], 'icon': 'assets/ribbon/icons/hot/Solution-Inventory.png' },
                'solution-checkout' : { 'valid_children' : ['project',  'project-locked'     ], 'icon': 'assets/ribbon/icons/hot/Locker.png'             },
                'solution-locked'   : { 'valid_children' : [                                 ], 'icon': 'assets/ribbon/icons/disabled/Locker.png'        },
                'project'           : { 'valid_children' : [                                 ], 'icon': 'assets/ribbon/icons/hot/Project.png'            },
                'project-locked'    : { 'valid_children' : [                                 ], 'icon': 'assets/ribbon/icons/disabled/Locker.png'        },
                'default'           : { 'valid_children' : ['default'                        ]                                                           }
            },
            search :
            {
                'fuzzy'             : false,
                'case_insensitive'  : true,
                'show_only_matches' : false,
                'ajax'              : (str : string, cb : any) => { this.search(str, cb); },
                'search_callback'   : (searchValue : string, node : any) =>
                {
                    if( searchValue[0] === '#' )
                    {
                        return node.id   === searchValue.substring(1);
                    }
                    else
                    {
                        return node.text.indexOf( searchValue ) >= 0;
                    }
                }
            },
            contextmenu :
            {
                'items' : (node : any) => { return this.contextMenu(node); },
            },
            plugins :
            [
                'contextmenu',
                'dnd',
            // 'state',  opens to last opened
                'search',
                'types'
            ]
        };

        this.tree.Create( this.treeOptions, '' );

        this.window.AddClass('gd-tree');    
        this.window.IsIconVisible   = true;
        this.window.Icon            = './assets/Images/favicon.ico';
        this.window.Name            = 'My Tree';
        this.window.Title           = 'GD Tree';
        this.window.IsOKVisible     = false;
        this.window.IsCancelVisible = false;
        this.window.Y =   40;
        this.window.X =   40;
        this.window.W =  270;
        this.window.H =  250;
        this.window.Open();

        var footer = this.window.Element.children[1].children[1].children[1].children[2];

        var                                myDIV1 = this.renderer.createElement('div');
        this.renderer.addClass(            myDIV1, 'treeSearchContainer');
        this.renderer.appendChild( footer, myDIV1 );

        var                                myINPUT = this.renderer.createElement('input');
        this.renderer.addClass(            myINPUT, 'treeSearchTemplate');
        this.renderer.setProperty(         myINPUT, 'spellcheck', false      );
        this.renderer.setProperty(         myINPUT, 'type',       'text'     );
        this.renderer.setProperty(         myINPUT, 'value',      'Solution1');
        this.renderer.appendChild( myDIV1, myINPUT );

        var                                myDIV2 = this.renderer.createElement('div');
        this.renderer.addClass(            myDIV2, 'treeSearchButton1' );
        this.renderer.setStyle(            myDIV2, 'float',  'right'   );
        this.renderer.setStyle(            myDIV2, 'cursor', 'pointer' );
        this.renderer.appendChild( myDIV1, myDIV2 );

        var                                myDIV3 = this.renderer.createElement('div');
        this.renderer.addClass(            myDIV3, 'treeSearchButton2');
        this.renderer.appendChild( myDIV2, myDIV3 );

        var                                myIMG = this.renderer.createElement('img');
        this.renderer.setProperty(         myIMG, 'src',    './assets/tree/default/Find.png' );
        this.renderer.setProperty(         myIMG, 'alt',    'Find' );
        this.renderer.setStyle(            myIMG, 'margin', '1px 0 0 0' );
        this.renderer.appendChild( myDIV3, myIMG );

        this.window.Element.querySelectorAll('div.treeSearchButton1 div').forEach( (item : any) =>
        {
            item.addEventListener('click', (event : any) =>
            {
                var          input = footer.children[0].children[0];
                var toFind = input.value;
                if( toFind.length < 2 ) return;

                this.tree.Search( toFind );
            }); 
        }); 

        document.getElementById('treeContainer').oncontextmenu = (event : any) =>
        {
            const node = $(event.target).closest('li');
            if(   node.length === 0 )
            {
                this.treeMenu.Show( event.pageX + 9, event.pageY + 20, 110, 29, [], this.el.nativeElement, this.treeName );                
            }
        };        
    }

    public  ngOnDestroy()
    {
        if( this.subscriptionIsLoaded ) this.subscriptionIsLoaded.unsubscribe();
        if( this.subscriptionSearch   ) this.subscriptionSearch  .unsubscribe();
        if( this.subscriptionAdded    ) this.subscriptionAdded   .unsubscribe();
        if( this.subscriptionOpened   ) this.subscriptionOpened  .unsubscribe();
        if( this.subscriptionClosed   ) this.subscriptionClosed  .unsubscribe();
        if( this.subscriptionSelected ) this.subscriptionSelected.unsubscribe();
        if( this.subscriptionHover    ) this.subscriptionHover   .unsubscribe();
        if( this.subscriptionDehover  ) this.subscriptionDehover .unsubscribe();

        if( this.subscriptionToParent ) this.subscriptionToParent.unsubscribe();
        if( this.subscriptionPgSave   ) this.subscriptionPgSave  .unsubscribe();
        if( this.subscriptionTooltip  ) this.subscriptionPgSave  .unsubscribe();
    }

    //#region Handlers
    public onPGIsReady( data : any ): void
    {
        this.pgWindow.ChildID = data;
    }

    private onIsLoaded( data : any ): void
    {
    }

    private onNodeSearch( data : any ): void
    {
        document.body.style.cursor = 'default';

        $('#treeSearchButton').css('cursor', 'default');

        this.tree.searchIDs   = [];
        this.tree.searchIndex = 0;

        this.tree.searchIDs.push( ...data.data.res );

        this.tree.searchIndex = 0;

        data.data.instance.deselect_all( true                                       );
        data.data.instance.select_node ( this.tree.searchIDs[this.tree.searchIndex] );
    }

    private onNodeAdded( data : any ): void
    {
    }    

    private onNodeDehover( data : any ): void
    {
    }

    private onNodeHover( data : any ): void
    {
    }

    private onNodeSelected( data : any ) : void
    {
    }

    private onNodeOpened( data : any ) : void
    {
        if( data.data.node.type === 'folder' )
        {
            data.data.instance.set_icon( data.data.node, 'assets/ribbon/icons/hot/Folder-opened.gif' );
        }
    }

    private onNodeClosed( data : any ) : void
    {
        if( data.data.node.type === 'folder' )
        {
            data.data.instance.set_icon( data.data.node, 'assets/ribbon/icons/hot/Folder-closed.gif' );
        }
    }

    public  onValueChange( data : any ) : void
    {
    }

    public  onFromChild( data : Message ) : void
    {
        if( data.parentID !== this.tree.ID ) return;

        switch( data.window )
        {
            case 'search' :
            {
                this.searchMessage.Close();
            }   
            break;

            case 'delete folder' :
            {
                this.deleteConfirm.Close();

                if( data.action === WindowButtons.ok )            
                { 
                    var                ids = this.tree.GetSelected();
                    this.deleteFolder( ids[0] );
                }
            }   
            break;

            case 'delete solution' :
            {
                this.deleteConfirm.Close();

                if( data.action === WindowButtons.ok )            
                { 
                    var                  ids = this.tree.GetSelected();
                    this.deleteSolution( ids[0] );
                }
            }   
            break;

            case 'delete project' :
            {
                this.deleteConfirm.Close();

                if( data.action === WindowButtons.ok )            
                { 
                    var                  ids = this.tree.GetSelected();
                    this.deleteProject( ids[0] );
                }
            }   
            break;

            case 'edit folder' :
            {
                if( data.result === 'valid'  )
                {
                    this.ShowFolderPG = false; 
                    this.pgWindow.Close(); 
                }
            }
            break;

            case 'edit solution' :
            {
                if( data.result === 'valid' )
                {
                    this.ShowSolutionPG = false; 
                    this.pgWindow.Close();
                }
            }
            break;

            case 'edit project' :
            {
                if( data.result === 'valid' )
                {
                    this.ShowSolutionPG = false; 
                    this.pgWindow.Close();
                }
            }
            break;
        }
    } 

    private onPGSave( data: IPGData ) : void
    {
        if( data.parentID !== this.tree.ID ) return;

        switch( data.action )
        {
            case 'add folder'    :  this.     newFolder( data.data.id, data.data );  break;        
            case 'add solution'  :  this.   newSolution( data.data.id, data.data );  break;        
            case 'add project'   :  this.    newProject( data.data.id, data.data );  break;        

            case 'edit folder'   :  this.  updateFolder( data.data.id, data.data );  break;
            case 'edit solution' :  this.updateSolution( data.data.id, data.data );  break;        
            case 'edit project'  :  this. updateProject( data.data.id, data.data );  break;        
        }
    }
    //#endregion

    private onTooltipRequest( data : any )
    {
        if( data === null ) this.tree.TooltipContent = '<div></div>';
        else
        {  
            if( data.parentID !== 'gd_tree_' + this.tree.ID ) return;

            let max_width  = 0;
            let max_height = 0;

            if( data.targetElement            === undefined ) return;
            if( data.targetElement.parentNode === undefined ) return;

            var nodeData   = this.tree.GetNodeData( data.targetElement.parentNode.id );
            if( nodeData === null ) return;

            var lines = nodeData.description.split('\n');
            if( lines.length === 1 && lines[0] === '' ) return;    //cannot find where this space is setted
                
            for( let i = 0; i < lines.length; ++i )
            {
                const                  size = this.tools.MeasureText( lines[i], '7pt Verdana', 'italic' );
                max_width  = Math.max( size.width + 4 + 4 + 4, max_width );
                max_height = size.height + 1;
            }

            let ext = lines.length === 1 ? 9 : 6;

            this.tree.tooltip.OffsetX = 12;
            this.tree.tooltip.OffsetY = 16;
            this.tree.tooltip.W       =  max_width;
            this.tree.tooltip.H       = (max_height + ext) * lines.length;
            this.tree.tooltip.Delay   = 1000;

            var str = '';

            for( let i = 0; i < lines.length; ++i )
            {
                str += '<div style="text-align:left; margin: 2px 0 0 4px;">' + lines[i] + '</div>';
            }

            this.tree.TooltipContent   = str;
            this.tree.tooltip.OffsetX += -this.window.X;
            this.tree.tooltip.OffsetY += -this.window.Y;
        }
    }

    public  onTreeAreaClickMenu( item : string )
    {
        switch( item )
        {
            case 'Add Folder' :
            {
                this.zone.run( () => 
                {
                    const model       = new Folder( Guid.newGuid(), 'New Folder', '', 'folder', null );
                    this.dataToEdit   = new PGData( 'FolderPG', this.tree.ID, 'add folder', model, null );
                    this.ShowFolderPG = true;
                });
    
                this.pgWindow.AddClass('gd-pg');    
                this.pgWindow.ParentID              = this.tree.ID;
                this.pgWindow.Name                  = 'add';
                this.pgWindow.Title                 = ' Folder';
                this.pgWindow.OK                    = 'Save';
                this.pgWindow.Cancel                = 'Cancel';
                this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
                this.pgWindow.IsIconVisible         = true;
                this.pgWindow.W                     = 404;
                this.pgWindow.H                     = 188;
                this.pgWindow.ButtonsActionToChild  = true;
                this.pgWindow.ButtonsActionToParent = true;
                this.pgWindow.SetModal( document, this.treeName );
                this.pgWindow.Open();
            }
            break;
        }

        this.treeMenu.Hide(null);
    }

    public  getChildren  ( node : any, cb : any )
    {
        let                   arg = node.id;
        if( node.id === '#' ) arg = Guid.Empty();

        this.dataService.getChildren( arg, node.type ).subscribe
        (
            data => this.OnComplated_GetChildren( data, cb )
        );
    }

    private OnComplated_GetChildren( node: any, cb: any )
    {
        cb.call( $(this.tree.element), node.children );
    }

    public  search( str : string, cb : any )
    {
        if( str[0] === '#' )
        {
            this.dataService.serachByID( str.substring(1) ).subscribe
            (
                data  => this.OnComplated_SearchSolution( data, cb ),
                error => this.OnRequestError            ( error    )
            );
        }
        else
        {
            this.dataService.serachByName( str, '' ).subscribe
            (
                data  => this.OnComplated_SearchSolution( data, cb ),
                error => this.OnRequestError            ( error    )
            );
        }
    }

    private OnComplated_SearchSolution( data: any, cb: any )
    {
        if( data instanceof Array )
        {
            cb.call( $(this.tree.element), data );
        }
        else
        {
            document.body.style.cursor = 'default';

            $('#treeSearchButton').css('cursor', 'default');

            this.zone.run( () => 
            {
                this.searchMessage.ParentID               = this.tree.ID;
                this.searchMessage.Name                   = 'search';
                this.searchMessage.Title                  = ' Search';
                this.searchMessage.Icon                   = './assets/Images/Warning.png';
                this.searchMessage.IsIconVisible          = true;
                this.searchMessage.W                      = 200;
                this.searchMessage.H                      = 110;
                this.searchMessage.IsOverlayLocked        = true;
                this.searchMessage.IsContentBorderVisible = false;
                this.searchMessage.IsMessageVisible       = false;
                this.searchMessage.IsCancelVisible        = false;
                this.searchMessage.IsOKVisible            = true;
                this.searchMessage.ButtonsActionToParent  = true;
                this.searchMessage.SetModal( document, this.treeName );
                this.searchMessage.Window.getElementsByClassName('gd_windowFooter')[0].style.background = 'transparent';
                this.searchMessage.Window.getElementsByClassName('gd_windowFooter')[0].style.border     = 'none';
                this.searchMessage.Open();
            });
        }
    }

    public  contextMenu( node: any )
    {
        try
        {
            let items = null;

            switch( node.type )
            {
                case 'folder' :
                {
                    items =
                    {
                        'item1' :
                        {
                            'label'     : 'Edit',
                            'icon'      : 'assets/tree/default/Edit.png',
                            '_disabled' : false,
                            'action'    : () => { this.editFolder(node); }
                        },
                        'item2' :
                        {
                            'label'     : 'Add Folder',
                            'icon'      : 'assets/tree/default/Add.png',
                            '_disabled' : false,
                            'action'    : () => { this.addFolder(node); }
                        },
                        'item3' :
                        {
                            'label'     : 'Add Solution',
                            'icon'      : 'assets/Images/Settings1.png',
                            '_disabled' : false,
                            'action'    : () => { this.addSolution(node); }
                        },
                        'item4' :
                        {
                            'label'     : 'Delete',
                            'icon'      : 'assets/tree/default/Delete.png',
                            '_disabled' : false,
                            'action'    : () => { this.deleteItemFolder(node); }
                        }
                    };
                }
                break;

                case 'solution-type1' : case 'solution-type2' : case 'solution-type3' : case 'solution-type4' :
                {
                    items =
                    {
                        'item1' :
                        {
                            'label'     : 'Edit',
                            'icon'      : 'assets/tree/default/Edit.png',
                            '_disabled' : false,
                            'action'    : () => { this.editSolution(node); }
                        },
                        'item2' :
                        {
                            'label'     : 'Add Project',
                            'icon'      : 'assets/tree/default/Add.png',
                            '_disabled' : false,
                            'action'    : () => { this.addProject(node); }
                        },
                        'item3' :
                        {
                            'label'     : 'Delete',
                            'icon'      : 'assets/tree/default/Delete.png',
                            '_disabled' : false,
                            'action'    : () => { this.deleteItemSolution(node); }
                        },
                        'item4' :
                        {
                            'label'     : 'Checkout',
                            'icon'      : 'assets/tree/default/Property.png',
                            '_disabled' : true,
                            'action'    : () => { this.checkOutSolution(node); }
                        },
                        'item5' :
                        {
                            'label'     : 'Checkin',
                            'icon'      : 'assets/tree/default/Property.png',
                            '_disabled' : true,
                            'action'    : () => { this.checkInSolution(node); }
                        },
                        'item6' :
                        {
                            'label'     : 'Lock',
                            'icon'      : 'assets/tree/default/Lock.png',
                            '_disabled' : true,
                            'action'    : () => { this.lockSolution(node); }
                        }
                    };
                }
                break;

                case 'solution-locked' :
                {
                    items =
                    {
                        'item1' :
                        {
                            'label'     : 'Unlock',
                            'icon'      : 'assets/dist/themes/default/Unlock.png',
                            '_disabled' : false,
                            'action'    : () => { this.unlockSolution(node); }
                        }
                    };

                    if( this.treeMode !== 'design' )
                    {
                        items.item1._disabled = true;
                    }
                }
                break;

                case 'project' :
                {
                    items =
                    {
                        'item1' :
                        {
                            'label'     : 'Edit',
                            'icon'      : 'assets/tree/default/Edit.png',
                            '_disabled' : false,
                            'action'    : () => { this.editProject(node); }
                        },
                        'item2' :
                        {
                            'label'     : 'Delete',
                            'icon'      : 'assets/tree/default/Delete.png',
                            '_disabled' : false,
                            'action'    : () => { this.deleteItemProject(node); }
                        },
                        'item3' :
                        {
                            'label'     : 'Lock',
                            'icon'      : 'assets/tree/default/Lock.png',
                            '_disabled' : true,
                            'action'    : () => { this.lockProject(node); }
                        }
                    };
                }
                break;

                case 'project-locked' :
                {
                    items =
                    {
                        'item1' :
                        {
                            'label'     : 'Unlock',
                            'icon'      : 'assets/dist/themes/default/Unlock.png',
                            '_disabled' : false,
                            'action'    : () => { this.unlockProject(node); }
                        }
                    };
                }
                break;
            }

            return items;
        }
        catch(e)
        {
            console.log(e.message);
        }
    }
    
    //#region Folder
    private editFolder( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                this.dataToEdit = new PGData( 'FolderPG', this.tree.ID, 'edit folder', node.data, node );
                this.ShowFolderPG = true; 
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'edit';
            this.pgWindow.Title                 = ' Folder';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Project Edit Folder');
        }
    }

    private addFolder( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                const model       = new Folder( Guid.newGuid(), 'New Folder', '', 'folder', node.id );
                this.dataToEdit   = new PGData( 'FolderPG', this.tree.ID, 'add folder', model, node.data.id );
                this.ShowFolderPG = true;
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'add';
            this.pgWindow.Title                 = ' Folder';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Add Folder');
        }
    }    

    private deleteItemFolder( node : any )
    {
        this.zone.run( () => 
        {
            this.deleteConfirm.ParentID               = this.tree.ID;
            this.deleteConfirm.Name                   = 'delete folder';
            this.deleteConfirm.Title                  = ' Confirm';
            this.deleteConfirm.Icon                   = './assets/Images/Question.png';
            this.deleteConfirm.IsIconVisible          = true;
            this.deleteConfirm.W                      = 216;
            this.deleteConfirm.H                      = 128;
            this.deleteConfirm.IsOverlayLocked        = true;
            this.deleteConfirm.IsContentBorderVisible = false;
            this.deleteConfirm.IsMessageVisible       = false;
            this.deleteConfirm.IsCancelVisible        = true;
            this.deleteConfirm.IsOKVisible            = true;
            this.deleteConfirm.ButtonsActionToParent  = true;
            this.deleteConfirm.SetModal( document, this.treeName );
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.background = 'transparent';
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.border     = 'none';
            this.deleteConfirm.Open();
        });
    }

    private updateFolder( id : string, folder : any )
    {
        this.dataService.updateFolder( id, folder ).subscribe
        (
            _id    => this.OnComplated_UpdateFolder( _id, folder ),
            _error => this.OnRequestError          ( _error      )
        );
    }

    private newFolder( id : string, child : any )
    {
        this.dataService.addFolder( id, child ).subscribe
        (
            _child => this.OnComplated_NewFolder( id, child ),
            _error => this.OnRequestError       ( _error    )
        );
    }

    private deleteFolder( id : string )
    {
        this.dataService.deleteFolder( id ).subscribe
        (
            child => this.OnComplated_DeleteFolder( id    ),
            error => this.OnRequestError          ( error )
        );
    }

    private OnComplated_UpdateFolder( id : string, data : any )
    {
        const node = this.tree.GetNodeItem( id );
              node.text = data.name;

        this.tree.RefreshNoReload();
    }

    private OnComplated_NewFolder   ( id : string, child : any )
    {
        var isAddNeeded  = false;
        var parent = null;

        var ids          = this.tree.GetSelected();
        if( ids.length === 0 ) { isAddNeeded = true; parent = '#'  }
        else
        {
                parent   = this.tree.GetNodeItem(ids[0]);
            if( parent.state.loaded ) isAddNeeded = true;
        }

        if( isAddNeeded )
        {
            const folder = new FolderViewModel( child );

            const node =
            {
                id      : id,
                type    : 'folder',
                text    : child.name,
                data    : folder,
                li_attr : { class : 'normal' }
            };

            this.tree.AddNode( node, parent, 'last' );
            // $(this.tree.tree).jstree(true).create_node( '#', child, 'last', false, false );
        }

        if( parent !== '#' )
        {
            this.tree.OpenNode( parent );
        }
    }

    private OnComplated_DeleteFolder( id : string )
    {
        var   node = this.tree.GetNodeItem( id );
        if(   node.state.loaded && node.children.length === 0 || 
            ! node.state.loaded )
        {
            this.tree.DeleteNode( id );
        }
        else
        {
            if( node.parent === '#' ) this.tree.Refresh();
            else                      this.tree.RefreshNode( node );
        }
    }
    //#endregion

    //#region Solution
    private editSolution( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                this.dataToEdit = new PGData( 'SolutionPG', this.tree.ID, 'edit solution', node.data, node );
                this.ShowFolderPG = true; 
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'edit';
            this.pgWindow.Title                 = ' Solution';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Project Edit Folder');
        }
    }

    private addSolution( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                const model         = new Solution( Guid.newGuid(), 'New Solution', '', 'type1', '', node.id );
                this.dataToEdit     = new PGData( 'SolutionPG', this.tree.ID, 'add solution', model, node.data.id );
                this.ShowSolutionPG = true;
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'add';
            this.pgWindow.Title                 = ' Solution';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/Images/Settings16.png';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Add Folder');
        }
    }    

    private deleteItemSolution( node : any )
    {
        this.zone.run( () => 
        {
            this.deleteConfirm.ParentID               = this.tree.ID;
            this.deleteConfirm.Name                   = 'delete solution';
            this.deleteConfirm.Title                  = ' Confirm';
            this.deleteConfirm.Icon                   = './assets/Images/Question.png';
            this.deleteConfirm.IsIconVisible          = true;
            this.deleteConfirm.W                      = 216;
            this.deleteConfirm.H                      = 128;
            this.deleteConfirm.IsOverlayLocked        = true;
            this.deleteConfirm.IsContentBorderVisible = false;
            this.deleteConfirm.IsMessageVisible       = false;
            this.deleteConfirm.IsCancelVisible        = true;
            this.deleteConfirm.IsOKVisible            = true;
            this.deleteConfirm.ButtonsActionToParent  = true;
            this.deleteConfirm.SetModal( document, this.treeName );
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.background = 'transparent';
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.border     = 'none';
            this.deleteConfirm.Open();
        });
    }

    private updateSolution( id : string, solution : any )
    {
        this.dataService.updateSolution( id, solution ).subscribe
        (
            _id    => this.OnComplated_UpdateSolution( _id, solution ),
            _error => this.OnRequestError            ( _error      )
        );
    }

    private newSolution( id : string, child : any )
    {
        this.dataService.addSolution( id, child ).subscribe
        (
            _child => this.OnComplated_NewSolution( id, child ),
            _error => this.OnRequestError         ( _error    )
        );
    }

    private deleteSolution( id : string )
    {
        this.dataService.deleteSolution( id ).subscribe
        (
            child => this.OnComplated_DeleteSolution( id    ),
            error => this.OnRequestError            ( error )
        );
    }

    private checkInSolution( node : any )
    {
        this.dataService.checkInSolution( node.id ).subscribe
        (
            _child => this.OnComplated_CheckInSolution( node.id ),
            _error => this.OnRequestError             ( _error   )
        );
    }

    private checkOutSolution( node : any )
    {
        this.dataService.checkOutSolution( node.id ).subscribe
        (
            _child => this.OnComplated_CheckOutSolution( node.id ),
            _error => this.OnRequestError              ( _error   )
        );
    }

    private lockSolution( node : any )
    {
        this.dataService.lockSolution( node.id ).subscribe
        (
            _child => this.OnComplated_LockSolution( node.id ),
            _error => this.OnRequestError          ( _error   )
        );
    }

    private unlockSolution( node : any )
    {
        this.dataService.unlockSolution( node.id ).subscribe
        (
            _child => this.OnComplated_UnlockSolution( node.id ),
            _error => this.OnRequestError            ( _error  )
        );
    }

    private OnComplated_UpdateSolution  ( id : string, data : any )
    {
        const node = this.tree.GetNodeItem( id );
              node.text = data.name;

        this.tree.RefreshNoReload();
    }

    private OnComplated_NewSolution     ( id : string, child : any )
    {
        var ids      = this.tree.GetSelected();
        var parent   = this.tree.GetNodeItem(ids[0]);
        if( parent.state.loaded )
        {
            const solution = new SolutionViewModel( child );

            const node =
            {
                id      : id,
                type    : 'solution-' + child.type,
                text    : child.name,
                data    : solution,
                li_attr : { class : 'normal' }
            };

            this.tree.AddNode ( node, parent, 'last' );
        }

        this.tree.OpenNode( parent );
    }

    private OnComplated_DeleteSolution  ( id : string )
    {
        var   node = this.tree.GetNodeItem( id );
        if(   node.state.loaded && node.children.length === 0 || 
            ! node.state.loaded )
        {
            this.tree.DeleteNode( id );
        }
        else
        {
            if( node.parent === '#' ) this.tree.Refresh();
            else                      this.tree.RefreshNode( node );
        }
    }

    private OnComplated_LockSolution    ( id : string )
    {
    }

    private OnComplated_UnlockSolution  ( id : string )
    {
    }

    private OnComplated_CheckInSolution ( id : string )
    {
    }

    private OnComplated_CheckOutSolution( id : string )
    {
    }
    //#endregion

    //#region Project
    private editProject( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                this.dataToEdit = new PGData( 'ProjectPG', this.tree.ID, 'edit project', node.data, node );
                this.ShowFolderPG = true; 
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'edit';
            this.pgWindow.Title                 = ' Project';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Project Edit Folder');
        }
    }

    private addProject( node : any )
    {
        try
        {
            this.zone.run( () => 
            {
                const model       = new Project( Guid.newGuid(), 'New Project', '', 'project', node.id );
                this.dataToEdit   = new PGData( 'ProjectPG', this.tree.ID, 'add project', model, node.data.id );
                this.ShowFolderPG = true;
            });

            this.pgWindow.AddClass('gd-pg');    
            this.pgWindow.ParentID              = this.tree.ID;
            this.pgWindow.Name                  = 'add';
            this.pgWindow.Title                 = ' Solution';
            this.pgWindow.OK                    = 'Save';
            this.pgWindow.Cancel                = 'Cancel';
            this.pgWindow.Icon                  = 'assets/ribbon/icons/hot/Folder-opened.gif';
            this.pgWindow.IsIconVisible         = true;
            this.pgWindow.W                     = 404;
            this.pgWindow.H                     = 188;
            this.pgWindow.ButtonsActionToChild  = true;
            this.pgWindow.ButtonsActionToParent = true;
            this.pgWindow.SetModal( document, this.treeName );
            this.pgWindow.Open();
        }
        catch(ex)
        {
            console.log('error - Add Project');
        }
    }    

    private deleteItemProject( node : any )
    {
        this.zone.run( () => 
        {
            this.deleteConfirm.ParentID               = this.tree.ID;
            this.deleteConfirm.Name                   = 'delete project';
            this.deleteConfirm.Title                  = ' Confirm';
            this.deleteConfirm.Icon                   = './assets/Images/Question.png';
            this.deleteConfirm.IsIconVisible          = true;
            this.deleteConfirm.W                      = 216;
            this.deleteConfirm.H                      = 128;
            this.deleteConfirm.IsOverlayLocked        = true;
            this.deleteConfirm.IsContentBorderVisible = false;
            this.deleteConfirm.IsMessageVisible       = false;
            this.deleteConfirm.IsCancelVisible        = true;
            this.deleteConfirm.IsOKVisible            = true;
            this.deleteConfirm.ButtonsActionToParent  = true;
            this.deleteConfirm.SetModal( document, this.treeName );
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.background = 'transparent';
            this.deleteConfirm.Window.getElementsByClassName('gd_windowFooter')[0].style.border     = 'none';
            this.deleteConfirm.Open();
        });
    }

    private updateProject( id : string, solution : any )
    {
        this.dataService.updateProject( id, solution ).subscribe
        (
            _id    => this.OnComplated_UpdateProject( _id, solution ),
            _error => this.OnRequestError            ( _error      )
        );
    }

    private newProject( id : string, child : any )
    {
        this.dataService.addProject( id, child ).subscribe
        (
            _child => this.OnComplated_NewProject( id, child ),
            _error => this.OnRequestError         ( _error    )
        );
    }

    private deleteProject( id : string )
    {
        this.dataService.deleteProject( id ).subscribe
        (
            child => this.OnComplated_DeleteProject( id    ),
            error => this.OnRequestError           ( error )
        );
    }

    private lockProject( node : any )
    {
        this.dataService.lockProject( node.id ).subscribe
        (
            _child => this.OnComplated_LockProject( node.id ),
            _error => this.OnRequestError         ( _error  )
        );
    }

    private unlockProject( node : any )
    {
        this.dataService.unlockProject( node.id ).subscribe
        (
            _child => this.OnComplated_UnlockProject( node.id ),
            _error => this.OnRequestError           ( _error  )
        );
    }

    private OnComplated_UpdateProject( id : string, data : any )
    {
        const node = this.tree.GetNodeItem( id );
              node.text = data.name;

        this.tree.RefreshNoReload();
    }

    private OnComplated_NewProject   ( id : string, child : any )
    {
        var ids      = this.tree.GetSelected();
        var parent   = this.tree.GetNodeItem(ids[0]);
        if( parent.state.loaded )
        {
            const folder = new ProjectViewModel( child );

            const node =
            {
                id      : id,
                type    : 'project',
                text    : child.name,
                data    : folder,
                li_attr : { class : 'normal' }
            };

            this.tree.AddNode( node, parent, 'last' );
        }

        this.tree.OpenNode( parent );
    }

    private OnComplated_DeleteProject( id : string )
    {
        var   node = this.tree.GetNodeItem( id );
        if(   node.state.loaded && node.children.length === 0 || 
            ! node.state.loaded )
        {
            this.tree.DeleteNode( id );
        }
        else
        {
            if( node.parent === '#' ) this.tree.Refresh();
            else                      this.tree.RefreshNode( node );
        }
    }

    private OnComplated_LockProject( id : string )
    {
    }

    private OnComplated_UnlockProject( id : string )
    {
    }
    //#endregion

    private OnRequestError( error: any )
    {
        this.errorMessage = error;
    }
}
