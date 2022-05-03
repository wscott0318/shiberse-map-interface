import React, { Component } from "react"
import * as PIXI from 'pixi.js'
import { isConsistsPointer, pauseEvent } from 'utils/mapHelper'
import { backRectPos, DarkRoadColors, DarkTileColors, hubNames, linePos, RoadColors, roadNames, shiboshiZonePos, TileColors } from "constants/map"

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
    multiSelect: boolean,
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
        
        // console.error(mapData)

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

            const hubTextArray = [] as any
            for( let i = 0; i < hubNames.length; i++ ) {
                const textStyle = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 36,
                    fontWeight: 'bold',
                    fill: ['#2d2e3b'],
                })
                let text = new PIXI.Text(hubNames[i].name, textStyle)
                text.anchor.set(0.5)
                hubTextArray.push(text)
                this.app.stage.addChild( text )
            }

            const roadTextArray = [] as any
            for( let i = 0; i < roadNames.length; i++ ) {
                const textStyle = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fill: ['#2d2e3b'],
                })
                let text = new PIXI.Text(roadNames[i].name, textStyle)
                text.anchor.set(0.5)
                if( roadNames[i].rotate )
                    text.rotation = Math.PI * 1.5
                roadTextArray.push(text)
                this.app.stage.addChild( text )
            }

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

                // draw hub names
                for( let i = 0; i < hubTextArray.length; i++ ) {
                    hubTextArray[i].x = Math.ceil((hubNames[i].x - this.props.mapCenterPos.x) * this.props.mapZoomLevel + this.app.screen.width / 2)
                    hubTextArray[i].y = Math.ceil((hubNames[i].y - this.props.mapCenterPos.y) * this.props.mapZoomLevel + this.app.screen.height / 2)
                    hubTextArray[i].style.fontSize = 1.8 * this.props.mapZoomLevel
                }

                // draw road names
                for( let i = 0; i < roadTextArray.length; i++ ) {
                    roadTextArray[i].x = Math.ceil((roadNames[i].x - this.props.mapCenterPos.x) * this.props.mapZoomLevel + this.app.screen.width / 2)
                    roadTextArray[i].y = Math.ceil((-roadNames[i].y - this.props.mapCenterPos.y) * this.props.mapZoomLevel + this.app.screen.height / 2)
                    roadTextArray[i].style.fontSize = 0.6 * this.props.mapZoomLevel
                }

                let hasFilterLand = false;
                for( let i = 0; i < spritesArray.length; i++ ) {
                    let mapLandInfo = Object.assign( this.mapInfo[i] )

                    if( mapLandInfo.isRoad )
                        drawRect({ graphics: backGraphic, startPos: { x: mapLandInfo.coordinates.x, y: -mapLandInfo.coordinates.y }, endPos: { x: mapLandInfo.coordinates.x, y: -mapLandInfo.coordinates.y }, fillColor: !this.isApplyFilter( mapLandInfo ) ? 0x1c1c1c : 0xcdcccc })

                    if( mapLandInfo.tierName === 'hub' )
                        drawRect({ graphics: backGraphic, startPos: { x: mapLandInfo.coordinates.x, y: -mapLandInfo.coordinates.y }, endPos: { x: mapLandInfo.coordinates.x, y: -mapLandInfo.coordinates.y }, fillColor: !this.isApplyFilter( mapLandInfo ) ? 0x202628 : 0x8FA8B3  })

                    spritesArray[i].anchor.set(0.5)
                    spritesArray[i].width = Math.ceil(this.props.mapZoomLevel * (0.9))
                    spritesArray[i].height = Math.ceil(this.props.mapZoomLevel * (0.9))
                    spritesArray[i].x = Math.ceil((mapLandInfo.coordinates.x - this.props.mapCenterPos.x) * this.props.mapZoomLevel + this.app.screen.width / 2)
                    spritesArray[i].y = Math.ceil((-mapLandInfo.coordinates.y - this.props.mapCenterPos.y) * this.props.mapZoomLevel + this.app.screen.height / 2)

                    spritesArray[i].tint = TileColors[ mapLandInfo.tierName as keyof typeof TileColors ]

                    if( !this.isApplyFilter( mapLandInfo ) )
                        spritesArray[i].tint = DarkTileColors[ mapLandInfo.tierName as keyof typeof DarkTileColors ]
                    else
                        hasFilterLand = true

                    if( mapLandInfo.isRoad && mapLandInfo.primaryRoadName !== '' ) {
                        spritesArray[i].width = Math.ceil(this.props.mapZoomLevel * (1))
                        spritesArray[i].height = Math.ceil(this.props.mapZoomLevel * (1))
                        if( this.isApplyFilter( mapLandInfo ) )
                            spritesArray[i].tint = RoadColors[ mapLandInfo.primaryRoadName as keyof typeof RoadColors ]
                        else
                            spritesArray[i].tint = DarkRoadColors[ mapLandInfo.primaryRoadName as keyof typeof DarkRoadColors ]
                    }

                    const selectIndex = this.props.selectedInfo.findIndex((item: any) => mapLandInfo.coordinates.x === item?.coordinates?.x && mapLandInfo.coordinates.y === item?.coordinates?.y)

                    if( selectIndex !== -1 )
                        spritesArray[i].tint = 0x49ad4e
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

        if( Number(searchOptions.searchMinPrice) !== Number(searchOptions.minPrice) 
            && Number(priceData.price) < Number(searchOptions.searchMinPrice) )
            return false

        if( ( Number(searchOptions.searchMaxPrice) !== Number(searchOptions.maxPrice) 
        && Number(priceData.price) > Number(searchOptions.searchMaxPrice) ) )
            return false

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

        if( searchOptions.openforbid && Number(priceData.bidCount) > 0 )
            return false
        if(
            (searchOptions.openforminting && Number(priceData.bidCount) > 0) ||
            (searchOptions.openforminting && priceData.minted)
        )
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

        if( !searchOptions.shiboshiZone && !searchOptions.privatehub && !searchOptions.diamond && !searchOptions.platinum && !searchOptions.gold && !searchOptions.silver )
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
        if( newCenterPosition.y < -99 )
            newCenterPosition.y = -99
        if( newCenterPosition.y > 100 )
            newCenterPosition.y = 100

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

            if( targetIndex !== -1 ) {
                if( !this.props.multiSelect || !this.props.selectedInfo.length || (this.props.selectedInfo.length > 0 && this.props.selectedInfo[0]?.isRoad || this.props.selectedInfo[0]?.tierName === 'hub' || this.props.selectedInfo[0]?.reserved) ) {
                    this.props.setSelectedInfo( [{ 
                        index: targetIndex,
                        show: true,
                        ...this.mapInfo[targetIndex]
                    }] )
                } else {
                    if( !this.mapInfo[targetIndex]?.isRoad && this.mapInfo[targetIndex]?.tierName !== 'hub' && !this.mapInfo[targetIndex]?.reserved ) {
                        const curSelectedInfo = [ ...this.props.selectedInfo ]
                        const curIndex = curSelectedInfo.findIndex((item: any) => item.coordinates.x === this.mapInfo[targetIndex].coordinates.x && item.coordinates.y === this.mapInfo[targetIndex].coordinates.y )
                        if( curIndex !== -1 ) {
                            curSelectedInfo.splice(curIndex, 1)
                        } else {
                            curSelectedInfo.push({
                                index: targetIndex,
                                show: true,
                                ...this.mapInfo[targetIndex]
                            })
                        }
                        this.props.setSelectedInfo( curSelectedInfo )
                    }
                }
            }
            else
                this.props.setSelectedInfo( [] )
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
        if( newCenterPosition.y < -99 )
            newCenterPosition.y = -99
        if( newCenterPosition.y > 100 )
            newCenterPosition.y = 100

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

            if( targetIndex !== -1 ) {
                if( !this.props.selectedInfo.length || (this.props.selectedInfo.length > 0 && this.props.selectedInfo[0]?.isRoad || this.props.selectedInfo[0]?.tierName === 'hub' || this.props.selectedInfo[0]?.reserved) ) {
                    this.props.setSelectedInfo( [{ 
                        index: targetIndex,
                        show: true,
                        ...this.mapInfo[targetIndex]
                    }] )
                } else {
                    if( !this.mapInfo[targetIndex]?.isRoad && this.mapInfo[targetIndex]?.tierName !== 'hub' && !this.mapInfo[targetIndex]?.reserved ) {
                        const curSelectedInfo = [ ...this.props.selectedInfo ]
                        const curIndex = curSelectedInfo.findIndex((item: any) => item.coordinates.x === this.mapInfo[targetIndex].coordinates.x && item.coordinates.y === this.mapInfo[targetIndex].coordinates.y )
                        if( curIndex !== -1 ) {
                            curSelectedInfo.splice(curIndex, 1)
                        } else {
                            curSelectedInfo.push({
                                index: targetIndex,
                                show: true,
                                ...this.mapInfo[targetIndex]
                            })
                        }
                        this.props.setSelectedInfo( curSelectedInfo )
                    }
                }
            }
            else
                this.props.setSelectedInfo( [] )
        }

        this.pointDownPos = null
    }

    render() {
        return (
            <></>
        )
    }
}