import React, { Component } from "react"
import * as PIXI from 'pixi.js'
import { mapPosInfo } from 'utils/mapData'
import { isConsistsPointer, pauseEvent, getMapColorByType } from 'utils/mapHelper'

type MapViewProps = {
    mapCenterPos: any,
    updateMapCenterPos: any,
    mapZoomLevel: any, 
    updateMapZoomLevel: any,
    selectedInfo: any,
    setSelectedInfo: any,
}

export default class Map extends Component<MapViewProps> {
    mapInfo: any
    spritesArray: any
    app: any
    pointDownPos: any
    moveDistance: any

    componentDidMount() {
        const mapInfo = JSON.parse( mapPosInfo )
        const spritesArray: any[] = []
        this.mapInfo = mapInfo
        this.spritesArray = spritesArray

        const onReady = () => {
            this.app = new PIXI.Application({ resizeTo: window, backgroundAlpha: 0, width: window.innerWidth, height: window.innerHeight })

            document.getElementById('mapContainer')?.appendChild( this.app.view )
            
            const container = new PIXI.ParticleContainer(100000, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true,
            })
            container._batchSize = 16383
            this.app.stage.addChild(container)

            for (let i = 0; i < mapInfo.length; i++) 
            {
                let bunny = new PIXI.Sprite( PIXI.Texture.WHITE )
                spritesArray.push(bunny)
                container.addChild(bunny)
            }

            this.app.ticker.add(() => {
                for( let i = 0; i < spritesArray.length; i++ ) {
                    spritesArray[i].width = Math.ceil(this.props.mapZoomLevel * 0.9)
                    spritesArray[i].height = Math.ceil(this.props.mapZoomLevel * 0.9)
                    spritesArray[i].x = Math.ceil((mapInfo[i].x - this.props.mapCenterPos.x) * this.props.mapZoomLevel + this.app.screen.width / 2)
                    spritesArray[i].y = Math.ceil((mapInfo[i].y - this.props.mapCenterPos.y) * this.props.mapZoomLevel + this.app.screen.height / 2)

                    if( i === this.props.selectedInfo.index )
                        spritesArray[i].tint = 0xfd33e6
                    else
                        spritesArray[i].tint = getMapColorByType( mapInfo[i].type )
                }
            })

            this.app.view.addEventListener('pointerdown', this.onPointerDownHandler.bind(this), false)
            this.app.view.addEventListener('pointermove', this.onPointerMoveHandler.bind(this), false)
            this.app.view.addEventListener('pointerout', this.onPointerUpHandler.bind(this), false)
            window.addEventListener('pointerup', this.onPointerUpHandler.bind(this), false)
            this.app.view.addEventListener('wheel', this.onWheelHandler.bind(this), false)

            this.app.view.addEventListener('touchstart', this.onTouchStartHandler.bind(this), false)
            this.app.view.addEventListener('touchmove', this.onTouchMoveHandler.bind(this), false)
            this.app.view.addEventListener('touchend', this.onTouchEndHandler.bind(this), false)
            window.addEventListener('touchcancel', this.onTouchEndHandler.bind(this), false)
        }

        onReady();
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

        this.props.updateMapCenterPos( newCenterPosition )
        this.pointDownPos = clickPosition
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
                    x: this.mapInfo[targetIndex].x + 1, 
                    y: this.mapInfo[targetIndex].y + 1, 
                    size: 1,
                    show: true,
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

        this.props.updateMapCenterPos( newCenterPosition )
        this.pointDownPos = clickPosition
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
                    x: this.mapInfo[targetIndex].x + 1, 
                    y: this.mapInfo[targetIndex].y + 1, 
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