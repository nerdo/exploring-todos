import { BehaviorSubject } from "rxjs";
import { getCopyOfDefaults } from "../defaults";

const { defaultListItems } = getCopyOfDefaults()

export const listItems$ = new BehaviorSubject([...defaultListItems])
