import { Component } from "@angular/core";

export interface Ng2SmartTableSettings {
  /** column Attributes are of Type Ng2SmartTableColumn */
  columns: Ng2SmartTableColumnMap,
  /** Settings for the table actions */
  actions?: Ng2SmartTableActions,
  /** Table attributes settings */
  attr?: Ng2SmartTableAttr,
  /** Settings for the table filter */
  filter?: Ng2SmartTableFilter,
  /** Edit action settings */
  edit?: Ng2SmartTableEditAction,
  /** Add action settings */
  add?: Ng2SmartTableAddAction,
  /** Delete action settings */
  delete?: Ng2SmartTableDeleteAction,
  /**
   * Set to true to not display the table header (which includes table column titles).
   * @default false
   */
  hideHeader?: boolean;
  /**
   * Set to true to not display the table sub-header (which includes filters and global table actions (currently - Add action))
   * @default false
   */
  hideSubHeader?: boolean;

  /**
   * Determines how to react on action links (Add, Edit, Delete).
   * 'external' - just trigger the events.
   * 'inline' - process internally, show forms/inputs/etc
   */
  mode?: 'external' | 'inline';

  /**
   * Message shown when there is no data in the table.
   * @default 'No data found' 
   */
  noDataMessage?: string;
  /**
   * Pager settings 
   */
  pager?: Ng2SmartTablePager;
  /** Handle css class for each row in the table
   *
   */
  rowClassFunction?: Function;
  selectMode?: 'multi' | 'single';
}

export interface Ng2SmartTableColumn {
  /**
   * Column title
   * @default ''
   */
  title?: string;
  /**
   * If type is text then cell value will be inserted as text.
   * If type is html then cell value will be inserted as html.
   * If type is custom the renderComponent property must be defined. 
   * @default 'text'
   */
  type?: 'text' | 'html' | 'custom';
  /**
   * Column class
   * @default ''
   */
  class?: string;
  /**
   *  Column width
   * @default ''
   * @example: '20px', '20%'
   */
  width?: string;
  /**
   * Whether to hide this column or not
   * @default false
   */
  hide?: boolean;
  /**
   * Whether this column is editable or not 
   * @default true
   */
  editable?: boolean;
  /**
   * Whether this column can be added or not?
   * @default true
   */
  addable?: boolean;
  /**
   * Editor attributes settings
   */
  editor?: Ng2SmartTableColumnEditor;
  /**
   * Column filter settings, enable/disable 
   * @default true
   */
  filter?: boolean | Ng2SmartTableColumnFilter;
  /**
   * Column sort settings, enable/disable.
   * @default true
   */
  sort?: boolean;
  /**
   * Sort table by this column with this direction by default.
   * Applied only when sort = true. 
   * Note: multiple sort option is not supported yet, so sortDirection can be applied to only one column per table. 
   */
  sortDirection?: 'asc' | 'desc';
  /**
   * Custom component that will be responsible for rendering the cell content while in view mode.
   * Type must be custom in order for this to work.
   * @example https://github.com/akveo/ng2-smart-table/blob/master/projects/demo/src/app/pages/examples/custom-edit-view/advanced-example-custom-editor.component.ts
   * @default null
   */
  renderComponent?: Component;
  /**
   * Function run against the values to sort the table 
   * @example (direction: any, a: string, b: string): number => {
   * }
   */
  compareFunction?: Function;
  /**
   * Function run against a value before it gets inserted into a cell.
   * You can use it to modify how a value is displayed in the cell.
   * This function will be invoked with 2 parameters: cell, row 
   * @example (cell, row) => {
    // example of cell value.... cell = 1543105073896
    // row is timeStamp
    if (!cell) return '';
    return moment(cell).format('DD/MM/YYYY');
  }
   */
  valuePrepareFunction?: Function;
  /**
   * Function run against the column value when filtering is happening
   * @example (cell?: any, search?: string): boolean => {
          if (cell >= search || search === '') {
            return true;
          } else {
            return false;
          }          
   */
  filterFunction?: Function;
  /**
   * Function which will be invoked after renderComponent instantiated and before ngOnInit hook.
   * This function gets renderComponent instance in first param.
   * @example (instance) => {
      instance.click.subscribe(() => { ... });
    }
   */
  onComponentInitFunction?: Function;
}

/**
 * Table attributes settings 
 */
export interface Ng2SmartTableAttr {
  /**
   * Table element id.
   * @default ''
   */
  id?: string;
  /**
   * Table element class.
   * @default ''
   */
  class?: string;
}

export interface Ng2SmartTableColumnMap {
  [attr: string]: Ng2SmartTableColumn;
}

export interface Ng2SmartTableColumnEditor {
  /**
   * Editor/Filter used when new row is added or edited
   * @default 'text'
   */
  type?: 'text' | 'textarea' | 'completer' | 'list' | 'checkbox' | 'custom';
  /**
   * Editor/Filter configuration settings. 
   * Mandatory only for editor types checkbox, completer, list
   */
  config?: Ng2SmartTableColumnEditorConfig;
  /**
   * Editor/Filter custom component:
   * Mandatory only for editor type custom
   */
  component?: Component;
}

export interface Ng2SmartTableColumnFilter extends Ng2SmartTableColumnEditor {
  config?: Ng2SmartTableColumnFilterConfig;
}

/**
 * Editor object attributes
 */
export interface Ng2SmartTableColumnEditorConfig {
  /**
   * Only on checkbox type.
   * Defines the value to assign when the checkbox is checked.
   * This parameter is optional, if omitted, true will be used. 
   * @default ''
   */
  true?: string;
  /**
   * Only on checkbox type.
   * Defines the value to assign when the checkbox is not checked.
   * This parameter is optional, if omitted, false will be used. 
   * @default ''
   */

  false?: string;
  /**
   * Only on list type. Example format:
   * HTML is supported if column type is 'html'
   * @example { value: 'Element Value', title: 'Element Title' }
   */
  list?: Array<Ng2SmartTableColumnEditorList>;
  /**
   * Only on list type. Enables multiple selection
   * @default false
   */
  multiple?: boolean;
  /**
   * Only on completer type. Example format: 
   * Completer configuration settings 
   */
  completer?: Ng2SmartTableColumnEditorCompleter;
}

export interface Ng2SmartTableColumnFilterConfig extends Ng2SmartTableColumnEditorConfig {
  /**
   * Only on checkbox type.
   * Defines the text of the button to reset the checkbox selection.
   * @example https://github.com/akveo/ng2-smart-table/blob/master/projects/demo/src/app/pages/examples/filter/advanced-example-filters.component.ts
   */
  resetText?: string;
}

/**
 * Attributes for 'list' editor
 */
export interface Ng2SmartTableColumnEditorList {
  /**
   * @default ''
   */
  value?: string;
  /**
   * @default ''
   */
  title?: string;
}

/**
 * Completer configuration settings 
 */
export interface Ng2SmartTableColumnEditorCompleter {
  /**
   * Autocomplete list data source.
   * @example { id: 10, name: 'Nick', email: 'rey@karina.biz' }
   * @default []
   */
  data?: Array<any>;
  /**
   * Comma separated list of fields to search on. 
   * Fields may contain dots for nested attributes.
   * If empty or null all data will be returned 
   * @default ''
   */
  searchFields?: string;
  /**
   * Name of the field to use as title for the list item
   * @default ''
   */
  titleField?: string;
  /**
   * Name of the field to use as description for the list item 
   * @default ''
   */
  descriptionField?: string;
}

export interface Ng2SmartTableFilter {
  /**
   * Filter input class 
   * @default ''
   */
  inputClass?: string;
}

/**
 * Settings for the table actions
 */
export interface Ng2SmartTableActions {
  /**
   * 
   */
  columnTitle?: string;
  /**
   * Show/not show Add button.
   * @default true
   */
  add?: boolean;
  /**
   * Show/not show Edit button.
   * @default true
   */
  edit?: boolean;
  /**
   * Show/not show Delete button.
   * @default true
   */
  delete?: boolean;
  /**
   * Custom buttons.
   */
  // TODO docs
  custom?: Ng2SmartTableCustomAction[];
  /**
   * Choose actions column position
   */
  position?: 'left' | 'right';
}

export interface Ng2SmartTableCustomAction {
  /**
   * Name/Identifier for the (custom) event handler
   */
  name?: string;
  /**
   * Button content/title.
   * @default ''.
   * Supports HTML
   */
  title?: string;
}

export interface Ng2SmartTableAddAction {
  /**
   * New row input class.
   * @default ''
   */
  intputClass?: string;
  /**
   * Add New button content/title. @default 'Add New'.
   * Supports HTML
   */
  addButtonContent?: string;
  /**
   * Create button content/title.
   * @default 'Create'.
   * Supports HTML
   */
  createButtonContent?: string;
  /**
   * Cancel button content/title.
   * @default 'Cancel'.
   * Supports HTML
   */
  cancelButtonContent?: string;
  /**
   * Enable/disable (confirmCreate) event.
   * If enabled data will be added only if confirm.resolve() called.
   * @default false
   */
  confirmCreate?: boolean;
}

/**
 * Delete action settings 
 */
export interface Ng2SmartTableDeleteAction {
  /**
   * Delete button content/title.
   * @default 'Delete'
   */
  deleteButtonContent?: string;
  /**
   * Enable/disable (confirmDelete) event.
   * If enabled data will be deleted only if confirm.resolve() called.
   * @default false
   */
  confirmDelete?: string;
}

export interface Ng2SmartTableEditAction {
  /**
   * Editing form input class. @default ''
   */
  inputClass?: string;
  /**
   * Edit row button content/title.
   * @default 'Edit'.
   * Supports HTML
   */
  editButtonContent?: string;
  /**
   * Update button content/title.
   * @default 'Update'.
   * Supports HTML
   */
  saveButtonContent?: string;
  /**
   * Cancel button content/title.
   * @default 'Cancel'.
   * Supports HTML 
   */
  cancelButtonContent?: string;
  /**
   * Enable/disable (confirmEdit) event. If enabled data will be edited only if confirm.resolve() called.
   * @default false
   */
  confirmSave?: boolean;
}

/**
 * Pager settings 
 */
export interface Ng2SmartTablePager {
  /**
   * Whether to display the pager or not.
   * @default true
  */
  display?: boolean;
  /**
   * Rows per page.
   * @default 10
   */
  perPage?: number;
}