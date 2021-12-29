import { BehaviorSubject } from "rxjs";
import { defaultListItems } from "../defaults";

export const listItems$ = new BehaviorSubject([...defaultListItems])
