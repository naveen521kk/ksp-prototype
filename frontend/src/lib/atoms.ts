import { atom } from "jotai";
import { PresidioOutput } from "./types";

export const presidioOpsAtom = atom<PresidioOutput[]>([]);
