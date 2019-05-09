interface SubOptionType {
    type?: number;
    name?: string;
    key?: string;
}

export interface OptionType {
    type?: number;
    name?: string;
    key?: string;
    subOption?: SubOptionType[];
 }
