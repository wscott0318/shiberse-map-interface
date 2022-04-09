import React, { Component } from "react"
import * as PIXI from 'pixi.js'
import { isConsistsPointer, pauseEvent } from 'utils/mapHelper'
import { backRectPos, DarkTileColors, linePos, shiboshiZonePos, TileColors } from "constants/map"

type MapViewProps = {
    mapCenterPos: any,
    updateMapCenterPos: any,
    mapZoomLevel: any, 
    updateMapZoomLevel: any,
    selectedInfo: any,
    setSelectedInfo: any,
    landData: any,
    searchOptions: any,
    clearFilter: any,
    setClearFilter: any,
    landPriceData: any,
}

export default class Map extends Component<MapViewProps> {
    mapInfo: any
    spritesArray: any
    app: any
    pointDownPos: any
    moveDistance: any

    constructor(props: MapViewProps) {
        super(props)

        this.onPointerDownHandler = this.onPointerDownHandler.bind(this)
        this.onPointerMoveHandler = this.onPointerMoveHandler.bind(this)
        this.onPointerUpHandler = this.onPointerUpHandler.bind(this)
        this.onWheelHandler = this.onWheelHandler.bind(this)
        this.onTouchStartHandler = this.onTouchStartHandler.bind(this)
        this.onTouchMoveHandler = this.onTouchMoveHandler.bind(this)
        this.onTouchEndHandler = this.onTouchEndHandler.bind(this)
        this.onKeyPressEventHandler = this.onKeyPressEventHandler.bind(this)
    }

    componentDidMount() {
        const mapData = this.props.landData
        
        console.error(mapData)

        const spritesArray: any[] = []
        this.mapInfo = mapData
        this.spritesArray = spritesArray

        const onReady = () => {
            this.app = new PIXI.Application({ resizeTo: window, backgroundAlpha: 0, width: window.innerWidth, height: window.innerHeight })

            document.getElementById('mapContainer')?.appendChild( this.app.view )

            const getScreenPos = ( val: any ) => ({
                x: Math.ceil((val.x - this.props.mapCenterPos.x - 0.5) * this.props.mapZoomLevel + this.app.screen.width / 2),
                y: Math.ceil((val.y - this.props.mapCenterPos.y - 0.5) * this.props.mapZoomLevel + this.app.screen.height / 2)
            })

            const drawRect = ( {graphics, startPos, endPos, fillColor, borderColor} : any ) => {
                if( fillColor )
                    graphics.beginFill( fillColor )

                if( borderColor )
                    graphics.lineStyle(this.props.mapZoomLevel * 0.1, borderColor, 1)

                const drawPos = getScreenPos( startPos )

                const drawWidth = (Math.abs(endPos.x - startPos.x) + 1) * this.props.mapZoomLevel
                const drawHeight = (Math.abs(endPos.y - startPos.y) + 1) * this.props.mapZoomLevel

                graphics.drawRect( drawPos.x, drawPos.y, drawWidth, drawHeight )

                if( fillColor )
                    graphics.endFill( fillColor )
            }

            const drawLine = ( { graphics, points, borderColor }: any ) => {
                graphics.lineStyle(this.props.mapZoomLevel * 0.1, borderColor, 1)

                const pointObj = {
                    x: points[0][0],
                    y: points[0][1]
                }
                graphics.moveTo( getScreenPos( pointObj ).x, getScreenPos( pointObj ).y )
                for( let i = 1; i < points.length; i++ ) {
                    pointObj.x = points[i][0]
                    pointObj.y = points[i][1]
                    graphics.lineTo( getScreenPos( pointObj ).x, getScreenPos( pointObj ).y )
                }
                graphics.closePath()
            }
            
            const backGraphic = new PIXI.Graphics();
            this.app.stage.addChild( backGraphic )


            const container = new PIXI.ParticleContainer(100000, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true,
            })
            container._batchSize = 16383
            this.app.stage.addChild(container)

            for (let i = 0; i < this.mapInfo.length; i++) 
            {
                let bunny = new PIXI.Sprite( PIXI.Texture.WHITE )
                spritesArray.push(bunny)
                container.addChild(bunny)
            }

            const hubGraphic = new PIXI.Graphics();
            this.app.stage.addChild( hubGraphic )

            this.app.ticker.add(() => {
                backGraphic.clear()
                hubGraphic.clear()
                
                backRectPos.forEach((item : any) => {
                    drawRect({ graphics: hubGraphic, startPos: { x: item.start.x + 1, y: item.start.y + 1 }, endPos: { x: item.end.x - 1, y: item.end.y - 1 }, borderColor: 0x13101b })
                })

                linePos.forEach((item: any) => {
                    drawLine({ graphics: hubGraphic, points: item, borderColor: 0x13101b })
                })

                // draw ShiboshiZone outline
                drawLine({ graphics: hubGraphic, points: shiboshiZonePos, borderColor: 0xa7352d })

                let hasFilterLand = false;
                for( let i = 0; i < spritesArray.length; i++ ) {
                    if( this.mapInfo[i].tierName === 'road' )
                        drawRect({ graphics: backGraphic, startPos: { x: this.mapInfo[i].coordinates.x, y: this.mapInfo[i].coordinates.y }, endPos: { x: this.mapInfo[i].coordinates.x, y: this.mapInfo[i].coordinates.y }, fillColor: !this.isApplyFilter( this.mapInfo[i] ) ? 0x1c1c1c : 0xcdcccc })

                    if( this.mapInfo[i].tierName === 'hub' )
                        drawRect({ graphics: backGraphic, startPos: { x: this.mapInfo[i].coordinates.x, y: this.mapInfo[i].coordinates.y }, endPos: { x: this.mapInfo[i].coordinates.x, y: this.mapInfo[i].coordinates.y }, fillColor: !this.isApplyFilter( this.mapInfo[i] ) ? 0x202628 : 0x8FA8B3  })

                    spritesArray[i].anchor.set(0.5)
                    spritesArray[i].width = Math.ceil(this.props.mapZoomLevel * (0.9))
                    spritesArray[i].height = Math.ceil(this.props.mapZoomLevel * (0.9))
                    spritesArray[i].x = Math.ceil((this.mapInfo[i].coordinates.x - this.props.mapCenterPos.x) * this.props.mapZoomLevel + this.app.screen.width / 2)
                    spritesArray[i].y = Math.ceil((this.mapInfo[i].coordinates.y - this.props.mapCenterPos.y) * this.props.mapZoomLevel + this.app.screen.height / 2)

                    if( this.mapInfo[i].coordinates.x === this.props.selectedInfo?.coordinates?.x && this.mapInfo[i].coordinates.y === this.props.selectedInfo?.coordinates?.y )
                        spritesArray[i].tint = 0x49ad4e
                    else {
                        spritesArray[i].tint = TileColors[ this.mapInfo[i].tierName as keyof typeof TileColors ]

                        if( !this.isApplyFilter( this.mapInfo[i] ) )
                            spritesArray[i].tint = DarkTileColors[ this.mapInfo[i].tierName as keyof typeof DarkTileColors ]
                        else
                            hasFilterLand = true
                    }
                }

                if( (hasFilterLand && this.props.clearFilter) || (!hasFilterLand && !this.props.clearFilter) )
                    this.props.setClearFilter()
            })

            this.app.view.addEventListener('pointerdown', this.onPointerDownHandler, false)
            this.app.view.addEventListener('pointermove', this.onPointerMoveHandler, false)
            this.app.view.addEventListener('pointerout', this.onPointerUpHandler, false)
            window.addEventListener('pointerup', this.onPointerUpHandler, false)
            this.app.view.addEventListener('wheel', this.onWheelHandler, false)

            this.app.view.addEventListener('touchstart', this.onTouchStartHandler, false)
            this.app.view.addEventListener('touchmove', this.onTouchMoveHandler, false)
            this.app.view.addEventListener('touchend', this.onTouchEndHandler, false)
            window.addEventListener('touchcancel', this.onTouchEndHandler, false)

            window.addEventListener('keydown', this.onKeyPressEventHandler, false)
        }

        onReady();
    }

    componentWillUnmount() {
        this.app.view.removeEventListener('pointerdown', this.onPointerDownHandler, false)
        this.app.view.removeEventListener('pointermove', this.onPointerMoveHandler, false)
        this.app.view.removeEventListener('pointerout', this.onPointerUpHandler, false)
        window.removeEventListener('pointerup', this.onPointerUpHandler, false)
        this.app.view.removeEventListener('wheel', this.onWheelHandler, false)

        this.app.view.removeEventListener('touchstart', this.onTouchStartHandler, false)
        this.app.view.removeEventListener('touchmove', this.onTouchMoveHandler, false)
        this.app.view.removeEventListener('touchend', this.onTouchEndHandler, false)
        window.removeEventListener('touchcancel', this.onTouchEndHandler, false)

        window.removeEventListener('keydown', this.onKeyPressEventHandler, false)

        this.app.destroy( true, { children: true, texture: true, baseTexture: true } )
    }

    isApplyFilter( item: any ) {
        const searchOptions = this.props.searchOptions

        const priceData = this.props.landPriceData[ item.id ]

        if( Number(priceData.price) < Number(searchOptions.searchMinPrice) || Number(priceData.price) > Number(searchOptions.searchMaxPrice) )
            return false

        // if( searchOptions.minPos.x !== null 
        //     && searchOptions.minPos.y !== null
        //     && searchOptions.maxPos.x !== null
        //     && searchOptions.maxPos.y !== null
        //     && (item.coordinates.x < searchOptions.minPos.x 
        //     || item.coordinates.y < searchOptions.minPos.y 
        //     || item.coordinates.x > searchOptions.maxPos.x
        //     || item.coordinates.y > searchOptions.maxPos.y) )
        //     return false

        if( searchOptions.minPos.x !== null && item.coordinates.x < searchOptions.minPos.x )
            return false
        if( searchOptions.minPos.y !== null && item.coordinates.y < searchOptions.minPos.y )
            return false
        if( searchOptions.maxPos.x !== null && item.coordinates.x > searchOptions.maxPos.x )
            return false
        if( searchOptions.maxPos.y !== null && item.coordinates.y > searchOptions.maxPos.y )
            return false

        if( searchOptions.walletAddress !== '' && (priceData.currentBidWinner?.toUpperCase() !== searchOptions.walletAddress.toUpperCase()) )
            return false
            
        if( searchOptions.shiboshiZone && item.isShiboshiZone )
            return true
        if( searchOptions.privatehub && item.tierName === 'hub' )
            return true
        if( searchOptions.diamond && item.tierName === 'tier1' )
            return true
        if( searchOptions.platinum && item.tierName === 'tier2' )
            return true
        if( searchOptions.gold && item.tierName === 'tier3' )
            return true
        if( searchOptions.silver && item.tierName === 'tier4' )
            return true
        if( searchOptions.openforbid && !item.noBidAllowedOnLand )
            return true
        if( !searchOptions.shiboshiZone && !searchOptions.privatehub && !searchOptions.diamond && !searchOptions.platinum && !searchOptions.gold && !searchOptions.silver && !searchOptions.openforbid )
            return true

        return false
    }

    onKeyPressEventHandler(e: any) {
        if( (e.ctrlKey && e.key === '-') || (e.ctrlKey && e.key === '=') ) {
            pauseEvent(e)

            this.props.updateMapZoomLevel( this.props.mapZoomLevel + (e.key === '-' ? -1 : 1) )
        }
    }

    onPointerDownHandler(e: any) {
        pauseEvent(e)
        const clickPosition = {
            x: e.offsetX,
            y: e.offsetY
        }

        this.pointDownPos = clickPosition
        this.moveDistance = 0
    }

    onPointerMoveHandler(e: any) {

        pauseEvent(e)
        if( !this.pointDownPos )
            return

        const clickPosition = {
            x: e.offsetX,
            y: e.offsetY
        }

        const diff = {
            x: clickPosition.x - this.pointDownPos.x,
            y: clickPosition.y - this.pointDownPos.y,
        }

        this.moveDistance += Math.sqrt( diff.x * diff.x + diff.y * diff.y )

        const newCenterPosition = {
            x: this.props.mapCenterPos.x - diff.x / this.props.mapZoomLevel,
            y: this.props.mapCenterPos.y - diff.y / this.props.mapZoomLevel,
        }

        this.pointDownPos = clickPosition
        
        if( newCenterPosition.x < -96 )
            newCenterPosition.x = -96
        if( newCenterPosition.x > 96 )
            newCenterPosition.x = 96
        if( newCenterPosition.y < -98 )
            newCenterPosition.y = -98
        if( newCenterPosition.y > 99 )
            newCenterPosition.y = 99

        this.props.updateMapCenterPos( newCenterPosition )
    }

    onPointerUpHandler(e: any) {
        pauseEvent(e)

        const threshold = 30
        if( this.pointDownPos && this.moveDistance < threshold ) {
            const clickPosition = { 
                x: e.offsetX,
                y: e.offsetY
            }

            const targetIndex = this.mapInfo.findIndex((item: any) => {
                return isConsistsPointer( item, this.props.mapZoomLevel, this.props.mapCenterPos, clickPosition, this.app.screen )
            })
    
            if( targetIndex !== -1 )
                this.props.setSelectedInfo( { 
                    index: targetIndex,
                    show: true,
                    ...this.mapInfo[targetIndex]
                } )
            else
                this.props.setSelectedInfo( {} )
        }

        this.pointDownPos = null
    }

    onWheelHandler(e: any) {
        pauseEvent(e)

        if( e.deltaY > 0 ) {
            this.props.updateMapZoomLevel( this.props.mapZoomLevel - 1 )
        } else {
            this.props.updateMapZoomLevel( this.props.mapZoomLevel + 1 )
        }
    }

    onTouchStartHandler(e: any) {
        pauseEvent(e)
        const clickPosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }

        this.pointDownPos = clickPosition
        this.moveDistance = 0
    }

    onTouchMoveHandler(e: any) {
        pauseEvent(e)
        if( !this.pointDownPos )
            return

        const clickPosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }

        const diff = {
            x: clickPosition.x - this.pointDownPos.x,
            y: clickPosition.y - this.pointDownPos.y,
        }

        this.moveDistance += Math.sqrt( diff.x * diff.x + diff.y * diff.y )

        const newCenterPosition = {
            x: this.props.mapCenterPos.x - diff.x / this.props.mapZoomLevel,
            y: this.props.mapCenterPos.y - diff.y / this.props.mapZoomLevel,
        }


        this.pointDownPos = clickPosition
        
        if( newCenterPosition.x < -96 )
            newCenterPosition.x = -96
        if( newCenterPosition.x > 96 )
            newCenterPosition.x = 96
        if( newCenterPosition.y < -98 )
            newCenterPosition.y = -98
        if( newCenterPosition.y > 99 )
            newCenterPosition.y = 99

        this.props.updateMapCenterPos( newCenterPosition )
    }

    onTouchEndHandler(e: any) {
        pauseEvent(e)

        const threshold = 30
        if( this.pointDownPos && this.moveDistance < threshold ) {
            const clickPosition = this.pointDownPos
    
            const targetIndex = this.mapInfo.findIndex((item: any) => {
                return isConsistsPointer( item, this.props.mapZoomLevel, this.props.mapCenterPos, clickPosition, this.app.screen )
            })

            if( targetIndex !== -1 )
                this.props.setSelectedInfo( { 
                    index: targetIndex, 
                    x: this.mapInfo[targetIndex].coordinates.x, 
                    y: this.mapInfo[targetIndex].coordinates.y, 
                    size: 1,
                    show: true,
                } )
            else
                this.props.setSelectedInfo( {} )
        }

        this.pointDownPos = null
    }

    render() {
        return (
            <></>
        )
    }
}