export const pixel = {
    x: 1,
    y: 1
};

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
    max: 50,
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

export const mapLandDataUrl = 'https://shiboshis.mypinata.cloud/ipfs/Qmap4SnwxpV6nCQZ9rgTXm8LtpyRjowcQB2UDhCfC1cohZ'

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
            y: -94,
        },
        end: {
            x: 11,
            y: -72,
        }
    }, {
        start: {
            x: -73,
            y: -74,
        },
        end: {
            x: -51,
            y: -52,
        }
    }, {
        start: {
            x: 51,
            y: -74,
        },
        end: {
            x: 73,
            y: -52,
        }
    }, {
        start: {
            x: -7,
            y: -47,
        },
        end: {
            x: 7,
            y: -33,
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
            y: -63,
        },
        end: {
            x: 50,
            y: -63,
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
            y: -51,
        },
        end: {
            x: -62,
            y: 52,
        }
    }, {
        start: {
            x: -22,
            y: -62,
        },
        end: {
            x: -22,
            y: 63,
        }
    }, {
        start: {
            x: 0,
            y: -71,
        },
        end: {
            x: 0,
            y: 72,
        }
    }, {
        start: {
            x: 22,
            y: -63,
        },
        end: {
            x: 22,
            y: 64,
        }
    }, {
        start: {
            x: 62,
            y: -51,
        },
        end: {
            x: 62,
            y: 52,
        }
    }
]