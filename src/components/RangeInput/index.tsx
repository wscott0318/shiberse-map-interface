import React from 'react'
import styled from 'styled-components'
import { Range, getTrackBackground } from "react-range";

const Wrapper = styled.div`
    &.disable {
        pointer-events: none;
        opacity: 0.5;
        display: none;
    }
`

const MinMaxWrapper = styled.div`
    color: ${({theme}) => theme.brown3};
    font-weight: 400;
    font-size: 12px;
`

export const RangeInput = ( { min, max, value, setValue, step = 1, disable = false }: any ) => {
    return (
        <Wrapper className={ disable ? 'disable' : '' }>
            <MinMaxWrapper className='flex justify-between items-center'>
                <div>Min. <span className='font-bold'>{` ${ step === 0.1 ? min.toFixed(1) : min }`}</span></div>
                <div>Max. <span className='font-bold'>{`${ step === 0.1 ? max.toFixed(1) : max }`}</span></div>
            </MinMaxWrapper>
{/*
 // @ts-ignore */}
            <Range
                values={value}
                step={step}
                min={min}
                max={max}
                onChange={(val) => setValue(val[0])}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: "36px",
                            display: "flex",
                            width: "100%"
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                            height: "13px",
                            width: "100%",
                            borderRadius: "32px",
                            border: '1px solid #B96A05',
                            background: getTrackBackground({
                                values: value,
                                colors: [ "#F8A93E" , "transparent"],
                                min: min,
                                max: max
                            }),
                            alignSelf: "center"
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "25px",
                            width: "13px",
                            backgroundColor: "#B96A05",
                            outline: "unset"
                        }}
                    >
                    </div>
                )}
                />
        </Wrapper>
    )
}

export default RangeInput