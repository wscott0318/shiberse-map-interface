import Diamond_Woof from 'assets/images/map/land/Diamond_Woof.svg'
import Golden_Tail from 'assets/images/map/land/Golden_Tail.svg'
import Platinum_Paw from 'assets/images/map/land/Platinum_Paw.svg'
import Private_Hubs from 'assets/images/map/land/Private_Hubs.svg'
import Roads from 'assets/images/map/land/Roads.svg'
import Silver_Fur from 'assets/images/map/land/Silver_Fur.svg'

export const pixel = {
    x: 1,
    y: 1
}

export const range = {
    x: 188,
    y: 189,
};

export const stageProps = {
    height: window.innerHeight - 5,
    width: window.innerWidth,
    options: {
        backgroundAlpha: 0,
        antialias: true,
        resizeTo: window,
    }
}

export const zoomRange = {
    min: 5,
    max: 80,
}

export const Events = {
    'Bid': 1,
    'Holder': 2,
    'Public': 3,
}

export const EventsText = {
    [Events['Bid']]: 'Bid event',
    [Events['Holder']]: 'Holder event',
    [Events['Public']]: 'Open for all',
}

/**
 * tier1 0xedb848
 * tier2 0x5a5c6b
 * tier3 0x75757e
 * tier4 0x2d2e3b
 * hubs 0x9fb1bc
 * Roads 0xd9d9d9
 * Reserved 0xcc4125
 * locked 0x161721
 */


export const TileColors = {
    'tier1': 0xedb848,
    'tier2': 0x5a5c6b,
    'tier3': 0x75757e,
    'tier4': 0x2d2e3b,
    'hub': 0x99B3BE,
    'road': 0xd9d9d9,
    'reserved': 0xcc4125,
    'locked': 0x161721,
}

export const DarkTileColors = {
    'tier1': 0x281f0c,
    'tier2': 0x18181c,
    'tier3': 0x141416,
    'tier4': 0x121318,
    'hub': 0x1e2224,
    'road': 0x262626,
    'reserved': 0x200a05,
    'locked': 0x161721,
}

export const RoadColors = {
    'WOOF STREET': 0xd9d9d9,
    'SHIB ROAD': 0xd9d9d9,
    'ALL TIME HIGH LANE': 0xd9d9d9,
    'WHALE STREET': 0xd9d9d9,
    'WEN STREET': 0xd9d9d9,
    'DECENTRALIZED CORRIDOR': 0xd9d9d9,
    'LEASH STREET': 0xd9d9d9,
    'BONE BOULEVARD': 0xd9d9d9,
    'FUD AVENUE': 0xd9d9d9,
}

export const DarkRoadColors = {
    'WOOF STREET': 0x262626,
    'SHIB ROAD': 0x262626,
    'ALL TIME HIGH LANE': 0x262626,
    'WHALE STREET': 0x262626,
    'WEN STREET': 0x262626,
    'DECENTRALIZED CORRIDOR': 0x262626,
    'LEASH STREET': 0x262626,
    'BONE BOULEVARD': 0x262626,
    'FUD AVENUE': 0x262626,
}

export const mapLandDataUrl = 'https://shiboshis.mypinata.cloud/ipfs/QmQW8ySF6tuCjQ7856vMpJHdYs4JZKKbS4zyiKDewLbpw8';

export const timerInfo = {
    [Events['Bid']]: {
        'desc': 'Bid Event Countdown',
        'endTime': 1650081599000,
    },
    [Events['Holder']]: {
        'desc': 'Private Mint event',
        'endTime': 1650686399000,
    },
    [Events['Public']]: {
        'desc': 'Private Mint event',
        'endTime': 1650686399000,
    },
}

export const apiServer = 'https://sbmv.herokuapp.com'

// export const apiServer = 'https://blabla-dev.herokuapp.com'

export const mapLandPriceDataUrl = apiServer + '/yards?$select[]=price&$select[]=id&$select[]=bidCount&$select[]=minted'

export const backRectPos = [
    {
        start: {
            x: -11,
            y: -11,
        },
        end: {
            x: 11,
            y: 11,
        }
    }, {
        start: {
            x: -11,
            y: -95,
        },
        end: {
            x: 11,
            y: -73,
        }
    }, {
        start: {
            x: -73,
            y: -75,
        },
        end: {
            x: -51,
            y: -53,
        }
    }, {
        start: {
            x: 51,
            y: -75,
        },
        end: {
            x: 73,
            y: -53,
        }
    }, {
        start: {
            x: -7,
            y: -48,
        },
        end: {
            x: 7,
            y: -34,
        }
    }, {
        start: {
            x: -92,
            y: -11,
        },
        end: {
            x: -70,
            y: 11,
        }
    }, {
        start: {
            x: 70,
            y: -11,
        },
        end: {
            x: 92,
            y: 11,
        }
    }, {
        start: {
            x: -7,
            y: 34,
        },
        end: {
            x: 7,
            y: 48,
        }
    }, {
        start: {
            x: -73,
            y: 53,
        },
        end: {
            x: -51,
            y: 75,
        }
    }, {
        start: {
            x: -11,
            y: 73,
        },
        end: {
            x: 11,
            y: 95,
        }
    }, {
        start: {
            x: 51,
            y: 53,
        },
        end: {
            x: 73,
            y: 75,
        }
    },
]

export const roadRectPos = [
    {
        start: {
            x: -50,
            y: -64,
        },
        end: {
            x: 50,
            y: -64,
        }
    }, {
        start: {
            x: -69,
            y: 0,
        },
        end: {
            x: 69,
            y: 0,
        }
    }, {
        start: {
            x: -50,
            y: 64,
        },
        end: {
            x: 50,
            y: 64,
        }
    }, {
        start: {
            x: -62,
            y: -52,
        },
        end: {
            x: -62,
            y: 52,
        }
    }, {
        start: {
            x: -22,
            y: -63,
        },
        end: {
            x: -22,
            y: 63,
        }
    }, {
        start: {
            x: 0,
            y: -72,
        },
        end: {
            x: 0,
            y: 72,
        }
    }, {
        start: {
            x: 22,
            y: -64,
        },
        end: {
            x: 22,
            y: 64,
        }
    }, {
        start: {
            x: 62,
            y: -52,
        },
        end: {
            x: 62,
            y: 52,
        }
    }
]

export const linePos = [
    [
        [-62, -52],
        [-73, -52],
        [-73, -75],
        [-50, -75],
        [-50, -64],
        [0, -64],
        [0, -72],
        [-11, -72],
        [-11, -95],
        [12, -95],
        [12, -72],
        [1, -72],
        [1, -64],
        [51, -64],
        [51, -75],
        [74, -75],
        [74, -52],
        [63, -52],
        [63, 0],
        [70, 0],
        [70, -11],
        [93, -11],
        [93, 12],
        [70, 12],
        [70, 1],
        [63, 1],
        [63, 53],
        [74, 53],
        [74, 76],
        [51, 76],
        [51, 65],
        [1, 65],
        [1, 73],
        [12, 73],
        [12, 96],
        [-11, 96],
        [-11, 73],
        [0, 73],
        [0, 65],
        [-50, 65],
        [-50, 76],
        [-73, 76],
        [-73, 53],
        [-62, 53],
        [-62, 1],
        [-69, 1],
        [-69, 12],
        [-92, 12],
        [-92, -11],
        [-69, -11],
        [-69, 0],
        [-62, 0],
    ], [
        [-61, -52],
        [-50, -52],
        [-50, -63],
        [-22, -63],
        [-22, 0],
        [-61, 0]
    ], [
        [-21, -63],
        [0, -63],
        [0, -48],
        [-7, -48],
        [-7, -33],
        [0, -33],
        [0, -11],
        [-11, -11],
        [-11, 0],
        [-21, 0]
    ], [
        [1, -63],
        [22, -63],
        [22, 0],
        [12, 0],
        [12, -11],
        [1, -11],
        [1, -33],
        [8, -33],
        [8, -48],
        [1, -48]
    ], [
        [23, -63],
        [51, -63],
        [51, -52],
        [62, -52],
        [62, 0],
        [23, 0]
    ], [
        [-61, 1],
        [-22, 1],
        [-22, 64],
        [-50, 64],
        [-50, 53],
        [-61, 53]
    ], [
        [-21, 1],
        [-21, 64],
        [0, 64],
        [0, 49],
        [-7, 49],
        [-7, 34],
        [0, 34],
        [0, 12],
        [-11, 12],
        [-11, 1]
    ], [
        [12, 1],
        [22, 1],
        [22, 64],
        [1, 64],
        [1, 49],
        [8, 49],
        [8, 34],
        [1, 34],
        [1, 12],
        [12, 12],
        [12, 12]
    ], [
        [23, 1],
        [62, 1],
        [62, 53],
        [51, 53],
        [51, 64],
        [23, 64]
    ]
]

export const shiboshiZonePos = [
    [12, -99],
    [78, -99],
    [78, -49],
    [65, -49],
    [65, -50],
    [76, -50],
    [76, -77],
    [49, -77],
    [49, -64],
    [12, -64]
]

export const landNames = {
    tier1: 'Diamond Teeth',
    tier2: 'Platinum Paw',
    tier3: 'Golden Tail',
    tier4: 'Silver Fur',
}

export const landImages = {
    tier1: Diamond_Woof,
    tier2: Platinum_Paw,
    tier3: Golden_Tail,
    tier4: Silver_Fur,
    road: Roads,
    hub: Private_Hubs,
}

export const hubNames = [
    {
        name: 'THE KENNEL CLUB',
        x: 0,
        y: -84,
    }, {
        name: 'DEFENSE VALLEY',
        x: -62,
        y: -64,
    }, {
        name: 'GROWTH DUNES',
        x: 62,
        y: -64,
    }, {
        name: 'BARK PARK',
        x: 0,
        y: -41,
    }, {
        name: 'ROCKET POND',
        x: -81,
        y: 0,
    }, {
        name: 'RYO PLAZA',
        x: 0,
        y: 0,
    }, {
        name: 'THE WAGMI TEMPLE',
        x: 81,
        y: 0,
    }, {
        name: 'THE BACKYARD',
        x: 0,
        y: 84,
    }, {
        name: 'TECH TRENCH',
        x: -62,
        y: 64,
    }, {
        name: 'CURRENCY CANYON',
        x: 62,
        y: 64,
    }, {
        name: 'FUD GROUND',
        x: 0,
        y: 41,
    }
]

export const roadNames = [
    {
        name: `SHIB'S ROAD`,
        x: 0,
        y: 64,
        rotate: false
    }, {
        name: `LEASH ST`,
        x: -40,
        y: 0,
        rotate: false
    }, {
        name: `LEASH ST`,
        x: 44,
        y: 0,
        rotate: false
    }, {
        name: `BONE BOULEVARD`,
        x: 0,
        y: -64,
        rotate: false
    }, {
        name: `ALL-TIME-HIGH LANE`,
        x: -62,
        y: 27,
        rotate: true
    }, {
        name: `WHALE ST`,
        x: -22,
        y: 31,
        rotate: true
    }, {
        name: `WEN ST`,
        x: 22,
        y: 31,
        rotate: true
    }, {
        name: `WOOF ST`,
        x: 0,
        y: 56,
        rotate: true
    }, {
        name: `WOOF ST`,
        x: 0,
        y: 22,
        rotate: true
    }, {
        name: `DECENTRALIZED CORRIDOR`,
        x: 62,
        y: 27,
        rotate: true
    }, {
        name: `ALL-TIME-HIGH LANE`,
        x: -62,
        y: -27,
        rotate: true
    }, {
        name: `WHALE ST`,
        x: -22,
        y: -31,
        rotate: true
    }, {
        name: `WEN ST`,
        x: 22,
        y: -31,
        rotate: true
    }, {
        name: `FUD AVENUE`,
        x: 0,
        y: -56,
        rotate: true
    }, {
        name: `FUD AVENUE`,
        x: 0,
        y: -22,
        rotate: true
    }, {
        name: `DECENTRALIZED CORRIDOR`,
        x: 62,
        y: -27,
        rotate: true
    }
]