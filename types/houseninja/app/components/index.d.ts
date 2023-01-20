declare module 'houseninja/app/components' {
  export interface Field {
    id: string;
    required: boolean;
    label?: string;
    placeholder?: string;
    type?: string;
    value?: string | number | boolean | null;
    disabled?: boolean;
  }

  export type FieldSet = Field[];
}
