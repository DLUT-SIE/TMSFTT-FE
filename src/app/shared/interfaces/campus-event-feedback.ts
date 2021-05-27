export interface CampusEventFeedback {
  id?: number;
  create_time?: string;
  update_time?: string;
  record?: number;
  content?: string;
  inspiring_level?: number;
  inspiring_less_reason?: string;
  profits?: number[];
  profit_other?: string;
  willingness_level?: number;
}

export interface InspiringLevelChoice {
  level?: number;
  level_str?: string;
}

export interface WillingnessLevelChoice {
  level?: number;
  level_str?: string;
}

export interface ProfitChoice {
  profit?: number;
  profit_str?: string;
}
