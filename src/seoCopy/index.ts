import type {ToolCopy} from './types'
import {textCopy} from './text'
import {developerCopy} from './developer'
import {securityCopy} from './security'
import {filesCopy} from './files'
import {calculatorCopy} from './calculators'

/** Hand-written intro + FAQ per tool. Tools without an entry fall back to category guidance in toolSeo.ts. */
export const toolCopy:Record<string,ToolCopy>={...textCopy,...developerCopy,...securityCopy,...filesCopy,...calculatorCopy}
export type {ToolCopy}
