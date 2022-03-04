import React, { Component } from "react";
import * as PIXI from 'pixi.js';
import { range, stageProps } from 'constants/map';
import { mapPosInfo } from 'utils/mapData';
import { pauseEvent, getMapColorByType } from 'utils/mapHelper';

type MiniMapViewProps = {
    mapCenterPos: any,
    updateMapCenterPos: any,
    mapZoomLevel: any, 
}

export default class MiniMap extends Component<MiniMapViewProps> {
    mapInfo: any
    spritesArray: any
    app: any
    pointDownPos: any

    componentDidMount() {
        const mapInfo = JSON.parse( mapPosInfo )
        const spritesArray: any = []
        this.mapInfo = mapInfo
        this.spritesArray = spritesArray

        const onReady = () => {
            this.app = new PIXI.Application({ width: range.x, height: range.y, antialias: true })

            document.getElementById('miniMapCanvas')?.appendChild( this.app.view )
            
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
                bunny.width = 1
                bunny.height = 1
                bunny.x = mapInfo[i].x
                bunny.y = mapInfo[i].y
                bunny.tint = getMapColorByType( mapInfo[i].type )

                spritesArray.push(bunny)
                container.addChild(bunny)
            }

            const graphics = new PIXI.Graphics()
            this.app.stage.addChild(graphics)

            this.app.ticker.add(() => {
                const targetX = this.props.mapCenterPos.x
                const targetY = this.props.mapCenterPos.y

                const width = range.x * ( stageProps.width / (range.x * this.props.mapZoomLevel) )
                const height = range.y * ( stageProps.height / (range.y * this.props.mapZoomLevel) )

                graphics.clear()
                graphics.lineStyle(2, 0xeb606f, 1)
                graphics.drawRect( targetX - width / 2, targetY - height / 2, width ,height )
            });

            this.app.view.addEventListener('pointerdown', this.onPointerDownHandler.bind(this), false)
            this.app.view.addEventListener('pointermove', this.onPointerMoveHandler.bind(this), false)
            this.app.view.addEventListener('pointerout', this.onPointerUpHandler.bind(this), false)
            window.addEventListener('pointerup', this.onPointerUpHandler.bind(this), false)

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
            x: (clickPosition.x - this.pointDownPos.x) * this.props.mapZoomLevel,
            y: (clickPosition.y - this.pointDownPos.y) * this.props.mapZoomLevel,
        }

        const newCenterPosition = {
            x: this.props.mapCenterPos.x + diff.x / this.props.mapZoomLevel,
            y: this.props.mapCenterPos.y + diff.y / this.props.mapZoomLevel,
        }

        this.props.updateMapCenterPos( newCenterPosition )
        this.pointDownPos = clickPosition
    }

    onPointerUpHandler(e: any) {
        pauseEvent(e)

        this.pointDownPos = null
    }

    onTouchStartHandler(e: any) {
        pauseEvent(e)

        const clickPosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }

        this.pointDownPos = clickPosition
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
            x: (clickPosition.x - this.pointDownPos.x) * this.props.mapZoomLevel,
            y: (clickPosition.y - this.pointDownPos.y) * this.props.mapZoomLevel,
        }

        const newCenterPosition = {
            x: this.props.mapCenterPos.x + diff.x / this.props.mapZoomLevel,
            y: this.props.mapCenterPos.y + diff.y / this.props.mapZoomLevel,
        }

        this.props.updateMapCenterPos( newCenterPosition )
        this.pointDownPos = clickPosition
    }

    onTouchEndHandler(e: any) {
        pauseEvent(e)

        this.pointDownPos = null;
    }

    render() {
        return (
            <></>
        )
    }
}