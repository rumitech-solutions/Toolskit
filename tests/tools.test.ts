import {describe,expect,it} from 'vitest'
import {categories,tools} from '../src/toolRegistry'
import {characterCount,characterCountNoSpaces,compoundInterest,convertCase,decodeBase64,decodeUrl,discount,encodeBase64,encodeUrl,formatJson,isValidJson,jsonToCsv,jsonToYaml,md5,minifyJson,regexTest,removeDuplicateLines,removeExtraSpaces,removeLineBreaks,reverseText,sentenceCount,sortLines,wordCount,secureRandomIndex} from '../src/tools'

describe('text tools',()=>{
 it('counts words, characters and sentences',()=>{expect(wordCount('one two\nthree')).toBe(3);expect(characterCount('a b')).toBe(3);expect(characterCountNoSpaces('a b')).toBe(2);expect(sentenceCount('One. Two!')).toBe(2)})
 it('converts and cleans text',()=>{expect(convertCase('hello world','snake')).toBe('hello_world');expect(removeDuplicateLines('a\na\nb')).toBe('a\nb');expect(removeExtraSpaces(' a   b ')).toBe('a b');expect(sortLines('b\na')).toBe('a\nb');expect(reverseText('abc')).toBe('cba');expect(removeLineBreaks('a\n b')).toBe('a b')})
})

describe('developer tools',()=>{
 it('formats, validates and minifies JSON',()=>{expect(isValidJson('{"a":1}')).toBe(true);expect(isValidJson('{bad')).toBe(false);expect(formatJson('{"a":1}')).toContain('\n');expect(minifyJson('{ "a": 1 }')).toBe('{"a":1}')})
 it('round trips Base64 and URL encoding',()=>{expect(decodeBase64(encodeBase64('héllo ✓'))).toBe('héllo ✓');expect(decodeUrl(encodeUrl('hello world?x=1&y=2'))).toBe('hello world?x=1&y=2')})
 it('converts JSON to CSV and YAML',()=>{expect(jsonToCsv('[{"a":1,"b":"x"}]')).toContain('"a","b"');expect(jsonToCsv('[{"a":"x,y"}]')).toContain('"x,y"');expect(jsonToYaml('{"a":1}')).toContain('a: 1')})
 it('matches known MD5 vectors',()=>{expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');expect(md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')})
 it('tests regex patterns with or without the global flag',()=>{expect(regexTest('a','i','Cat A')).toEqual([{match:'a',index:1,groups:[]}]);expect(regexTest('(a)','gi','A a')).toEqual([{match:'A',index:0,groups:['A']},{match:'a',index:2,groups:['a']}])})
})

describe('security helpers',()=>{
 it('maps only unbiased random uint32 values to alphabet indexes',()=>{
  expect(secureRandomIndex(0,10)).toBe(0)
  expect(secureRandomIndex(9,10)).toBe(9)
  expect(secureRandomIndex(4294967295,10)).toBeNull()
 })
})

describe('calculators',()=>{it('calculates discount and compound interest',()=>{expect(discount(100,10)).toBe(90);expect(compoundInterest(100,10,1)).toBeCloseTo(110.47)})})

describe('tool registry',()=>{
 it('contains every requested category and unique slugs',()=>{expect(categories).toEqual(['All','Text','Developer','PDF','Image','Calculators','Security','Finance','Health','Design','Productivity']);const ids=tools.map(t=>t.id);expect(new Set(ids).size).toBe(ids.length);expect(tools.length).toBeGreaterThanOrEqual(60);for(const tool of tools)expect(tool.id).toMatch(/^[a-z0-9-]+$/)})
 it('has local-processing metadata for file tools',()=>{expect(tools.filter(t=>t.file).length).toBeGreaterThan(15);expect(tools.filter(t=>t.file).every(t=>t.description.toLowerCase().includes('local')||t.description.toLowerCase().includes('browser'))).toBe(true)})
})
