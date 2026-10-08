import { specs as base, type Spec } from './specs'
import { specs2 } from './specs2'
import { specs3 } from './specs3'

export const allSpecs: Record<string, Spec> = { ...base, ...specs2, ...specs3 }
