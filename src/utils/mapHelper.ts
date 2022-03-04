export const getRandValue = (val: any) => Math.ceil(Math.random() * 100000000) % val

export const rad2Ang = (rad: any) => rad * 180 / Math.PI

export const ang2Rad = (ang: any) => ang * Math.PI / 180

// Land Map
export const isConsistsPointer = ( land: any, landSize: any, centerPos: any, position: any, screen: any ) => {
    const x = Math.ceil((land.x - centerPos.x) * landSize + screen.width / 2)
    const y = Math.ceil((land.y - centerPos.y) * landSize + screen.height / 2)

    return position.x >= x && position.y >= y && position.x <= x + landSize && position.y <= y + landSize
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