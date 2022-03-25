import React from 'react'
import styled from 'styled-components'
import { Range, getTrackBackground } from "react-range";

const MinMaxWrapper = styled.div`
    color: ${({theme}) => theme.brown3};
    font-weight: 400;
    font-size: 12px;
`

export const RangeInput = ( { min, max, value, setValue, step = 1 }: any ) => {
    return (
        <div>
            <MinMaxWrapper className='flex justify-between items-center'>
                <span>{`Min. ${min}`}</span>
                <span>{`Max. ${max}`}</span>
            </MinMaxWrapper>

            <Range
                values={value}
                step={step}
                min={min}
                max={max}
                onChange={(value) => setValue(value)}
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
                            height: "10px",
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
                            height: "22px",
                            width: "13px",
                            backgroundColor: "#B96A05",
                            outline: "unset"
                        }}
                    >
                    </div>
                )}
                />
        </div>
    )
}

export default RangeInput