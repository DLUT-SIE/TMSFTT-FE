interface DataType {
    type?: number;
    name?: string;
}

interface SubOptionType {
    name?: string;
    subOption?: DataType[];
}

export interface OptionType {
    type?: number;
    option?: SubOptionType;
 }
