import { landNames, landImages } from "constants/map"

export const getRandValue = (val: any) => Math.ceil(Math.random() * 100000000) % val

export const rad2Ang = (rad: any) => rad * 180 / Math.PI

export const ang2Rad = (ang: any) => ang * Math.PI / 180

// Land Map
export const isConsistsPointer = ( land: any, landSize: any, centerPos: any, position: any, screen: any ) => {
    const x = Math.ceil((land.coordinates.x - centerPos.x) * landSize + screen.width / 2)
    const y = Math.ceil((-land.coordinates.y - centerPos.y) * landSize + screen.height / 2)

    // for anchor 0
    // return position.x >= x && position.y >= y && position.x <= x + landSize && position.y <= y + landSize

    // for anchor 0.5
    return position.x >= x - landSize / 2 && position.y >= y - landSize / 2 && position.x <= x + landSize / 2 && position.y <= y + landSize / 2
}

export const pauseEvent = (e: any) => {
    if(e.stopPropagation) e.stopPropagation()
    if(e.preventDefault) e.preventDefault()
    e.cancelBubble=true
    e.returnValue=false
    return false
}

export const getMapColorByType = (type: any) => {
    return type === 1 ? 0xd0e0e3 : type === 2 ? 0xd9ead3 : type === 3 ? 0xf4cccc : type === 4 ? 0xffd966 : type === 5 ? 0x6aa84d : 0x000000
}

export const getLandName = (name: any, info: any) => {
    if( landNames[name as keyof typeof landNames] )
        return landNames[name as keyof typeof landNames]
    if( name === 'hub' ) {
        if( info.coordinates.x >= -92 && info.coordinates.x <= -70 && info.coordinates.y >= -11 && info.coordinates.y <= 11 )
            return 'ROCKET POND'

        return info.hubName.toUpperCase()
    }
    if( name === 'road' ) {
        return info.primaryRoadName
    }
} 
export const getLandImage = (name: any) => landImages[name as keyof typeof landImages] ? landImages[name as keyof typeof landImages] : name

export const getFixedValue = ( val: string, decimals: number ) => {
    const temp = val.split('.')
    const count = temp.length === 1 ? 0 : temp[1].length

    for(let i = 0; i < decimals - count; i++)
        val += '0'

    return val
}