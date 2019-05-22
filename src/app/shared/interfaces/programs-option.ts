export interface Program {
  id?: number;
  name?: string;
  department?: number;
}

export interface ProgramsOption {
    id?: number;
    name?: string;
    programs?: Program[];
}
