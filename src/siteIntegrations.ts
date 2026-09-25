export const envValue=(value:unknown)=>typeof value==='string'?value.trim():''

export const isGaMeasurementId=(value:string)=>/^G-[A-Z0-9]+$/i.test(envValue(value))

export const isAdsenseClientId=(value:string)=>/^ca-pub-\d{16}$/.test(envValue(value))

export const isAdsenseSlotId=(value:string)=>/^\d+$/.test(envValue(value))
