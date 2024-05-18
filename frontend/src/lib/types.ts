export type PresidioOutput = {
  start: number;
  end: number;
  entity_type: string;
  score: number;
  text: string;
};

export type Mask = {
  start: number;
  end: number;
  entity_type: string;
  original_text: string;
  options: {
    score: number;
    token_str: string;
  }[];
};

export type ModelOutput = {
  anonymized_text: string;
  mask_list: Mask[];
};
