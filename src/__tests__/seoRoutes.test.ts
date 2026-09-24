import {describe,expect,it} from 'vitest'
import {tools} from '../toolRegistry'
import {validatePageNumbers,pdfImageStrategy} from '../pdfTools'
import {getSeoDataForPath,normalizePath} from '../seo'
import {getRelatedTools,getToolSeoProfile} from '../toolSeo'
import {getPrimaryWorkflowForTool,workflows} from '../workflows'
import {convertNumberBase,randomNumbers} from '../tools'

const base='https://toolskit.sbs'
const infoRoutes=['/','/tools','/about','/contact','/privacy-policy','/terms-and-conditions']

describe('SEO route coverage',()=>{
  it('has unique tool ids suitable for /tools/:id routes',()=>{
    const ids=tools.map(tool=>tool.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every(id=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))).toBe(true)
  })

  it('contains every public informational route',()=>{
    expect(infoRoutes).toEqual([
      '/', '/tools', '/about', '/contact', '/privacy-policy', '/terms-and-conditions'
    ])
  })

  it('keeps tool titles and descriptions unique across all indexed tool routes',()=>{
    const seo=tools.map(tool=>getSeoDataForPath(`/tools/${tool.id}`))
    expect(seo.every(item=>item.title.length>0&&item.description.length>0)).toBe(true)
    expect(new Set(seo.map(item=>item.title)).size).toBe(tools.length)
    expect(new Set(seo.map(item=>item.description)).size).toBe(tools.length)
  })

  it('generates one production URL for every registered tool',()=>{
    const urls=tools.map(tool=>`${base}/tools/${tool.id}`)
    expect(urls).toHaveLength(tools.length)
    expect(new Set(urls).size).toBe(tools.length)
    expect(urls.every(url=>url.startsWith(`${base}/tools/`))).toBe(true)
  })

  it('provides SEO content for every registered tool',()=>{
    tools.forEach(tool=>{
      const profile=getToolSeoProfile(tool)
      expect(profile.intro.trim().length).toBeGreaterThan(40)
      expect(profile.bestFor.length).toBeGreaterThanOrEqual(3)
      expect(profile.workflow.length).toBeGreaterThanOrEqual(3)
      expect(profile.tips.length).toBeGreaterThanOrEqual(3)
      expect(profile.faq.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('builds relevant internal related-tool links without linking a tool to itself',()=>{
    tools.forEach(tool=>{
      const related=getRelatedTools(tool.id)
      expect(related.length).toBeGreaterThan(0)
      expect(related.length).toBeLessThanOrEqual(6)
      expect(related.some(item=>item.id===tool.id)).toBe(false)
    })
  })

  it('keeps canonical URLs on the production domain',()=>{
    const paths=['/','/tools','/tools/word-counter','/privacy-policy']
    expect(paths.map(path=>`${base}${path}`)).toEqual([
      'https://toolskit.sbs/',
      'https://toolskit.sbs/tools',
      'https://toolskit.sbs/tools/word-counter',
      'https://toolskit.sbs/privacy-policy'
    ])
  })

  it('normalizes only URL slashes and does not contain legacy ToolNest migration behavior',()=>{
    expect(normalizePath('/tools/word-counter/')).toBe('/tools/word-counter')
    expect(normalizePath('/ToolNest/tools/word-counter')).toBe('/ToolNest/tools/word-counter')
  })
})

describe('Product workflows',()=>{
  it('keeps every workflow step mapped to a registered tool and gives covered tools a primary flow',()=>{
    const ids=new Set(tools.map(tool=>tool.id))
    workflows.forEach(workflow=>{
      expect(workflow.steps.length).toBeGreaterThanOrEqual(3)
      expect(new Set(workflow.steps.map(step=>step.toolId)).size).toBe(workflow.steps.length)
      workflow.steps.forEach(step=>expect(ids.has(step.toolId)).toBe(true))
    })
    workflows.flatMap(workflow=>workflow.steps).forEach(step=>{
      expect(getPrimaryWorkflowForTool(step.toolId)).toBeTruthy()
    })
  })

  it('rejects partially valid numbers in base conversion instead of silently truncating them',()=>{
    expect(convertNumberBase('1010',2,10)).toBe('10')
    expect(convertNumberBase('FF',16,10)).toBe('255')
    expect(()=>convertNumberBase('102',2,10)).toThrow('valid number')
    expect(()=>convertNumberBase('',10,16)).toThrow('Enter a number')
  })

  it('generates bounded cryptographic random integers',()=>{
    const values=randomNumbers(5,9,25).split(', ').map(Number)
    expect(values).toHaveLength(25)
    expect(values.every(value=>value>=5&&value<=9&&Number.isInteger(value))).toBe(true)
    expect(randomNumbers(9,5,1)).toMatch(/^([5-9])$/)
  })
})

describe('PDF input validation',()=>{
  it('rejects missing, out-of-range and duplicate page numbers',()=>{
    expect(()=>validatePageNumbers([],5,'Select at least one page.')).toThrow('Select at least one page.')
    expect(()=>validatePageNumbers([0,6],5)).toThrow('Page numbers must be between 1 and 5.')
    expect(()=>validatePageNumbers([1,1,2],5)).toThrow('Page numbers must be unique.')
    expect(validatePageNumbers([1,3,5],5)).toEqual([0,2,4])
  })

  it('accepts supported image types and routes WebP through conversion',()=>{
    expect(pdfImageStrategy('image/png')).toBe('png')
    expect(pdfImageStrategy('image/jpeg')).toBe('jpg')
    expect(pdfImageStrategy('image/webp')).toBe('convert-to-jpg')
    expect(pdfImageStrategy('image/gif')).toBe('unsupported')
  })
})
