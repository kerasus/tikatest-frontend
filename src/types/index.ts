import { type Component } from 'vue'

export type TabPanelRoutingItem = {
  icon: string,
  title: string,
  route: { name: string, query?: Record<string, string> },
  mainRouteName?: string
}

export type BasicInfoItem = {
  id: string | number,
  title: string
}

export type QTableColumnItem = {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean | undefined;
  align?: 'left' | 'right' | 'center' | undefined;
  sortable?: boolean | undefined;
  sort?: ((a: any, b: any, rowA: any, rowB: any) => number) | undefined;
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: 'ad' | 'da';
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
}

export type FormBuilderInputType = {
  type?: string | Component;
  name?: string;
  value?: any;
  responseKey?: string;
  tabindex?: number;
  col?: string;
  label?: string;
  disable?: boolean;
  loading?: boolean;
  labelTranslated?: boolean | undefined;
  rules?: string | ((inputValue: string | number) => string | boolean)[];
  clearable?: boolean;
  class?: string;
  hint?: string
  placeholder?: string;
  filled?: boolean;
  fillMask?: string;
  reverseFillMask?: boolean;
  lazyRules?: boolean;
  outlined?: boolean;
  readonly?: boolean;
  dense?: boolean;
  rounded?: boolean;
  error?: boolean;
  errorMessage?: string;
  title?: string;
  color?: string | boolean;

  // date/time
  calendar?: 'persian' | 'gregorian';
  range?: boolean;
  defaultYearMonth?: string;
  todayBtn?: boolean;
  closeColorBtn?: string;
  mask?: string;
  persistentMenu?: boolean;
  daysOptions?: number[];
  displayDateTime?: string;
  toggleMenu?: boolean;
  calendarIcon?: string;
  clockIcon?: string;
  withTime?: boolean;
  limitPast?: boolean;
  convertToZone?: boolean;
  iso8601?: boolean;

  // select inputs
  options?: any[];
  optionValue?: string;
  optionLabel?: string;
  onChangeValue?: (newValue: any) => void;

  // select and file inputs
  multiple?: boolean;

  // input
  inputType?: string;
  maxlength?: number;

  // date
  limitFuture?: boolean;

  // checkbox
}
