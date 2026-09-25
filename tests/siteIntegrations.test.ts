import {describe,expect,it} from 'vitest'
import {isAdsenseClientId,isAdsenseSlotId,isGaMeasurementId} from '../src/siteIntegrations'

describe('site integration identifiers',()=>{
  it('accepts valid GA4 measurement IDs',()=>{
    expect(isGaMeasurementId('G-ABC123')).toBe(true)
    expect(isGaMeasurementId('gt-ABC123')).toBe(false)
    expect(isGaMeasurementId('')).toBe(false)
  })

  it('accepts valid AdSense publisher clients',()=>{
    expect(isAdsenseClientId('ca-pub-1234567890123456')).toBe(true)
    expect(isAdsenseClientId('ca-pub-123456')).toBe(false)
    expect(isAdsenseClientId('pub-1234567890123456')).toBe(false)
  })

  it('accepts numeric AdSense slot IDs only',()=>{
    expect(isAdsenseSlotId('1234567890')).toBe(true)
    expect(isAdsenseSlotId('slot-123')).toBe(false)
    expect(isAdsenseSlotId('')).toBe(false)
  })
})
