import React from 'react'
import styled from 'styled-components'
import { Range, getTrackBackground } from "react-range";
import { shortenDouble } from 'utils';

const Wrapper = styled.div`
    &.disable {
        pointer-events: none;
        opacity: 0.5;
        display: none;
    }
`

const MinMaxWrapper = styled.div`
    font-weight: 500;
    font-size: 13px;
    line-height: 21px;
    color: #785838;

    margin-bottom: .5rem;
`

export const RangeInputMinMax = ( { min, max, values, setValues, step = 1, disable = false }: any ) => {
    return (
        <Wrapper className={ disable ? 'disable' : '' }>
            <MinMaxWrapper>
                Price range: { values[0] } ETH - { step === 0.1 ? shortenDouble(values[1], 2) : values[1] } ETH
            </MinMaxWrapper>
{/*
 // @ts-ignore */}
            <Range
                values={values}
                step={step}
                min={min}
                max={max}
                onChange={(val) => setValues(val)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: "25px",
                            display: "flex",
                            width: "100%"
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: "9px",
                                width: "100%",
                                borderRadius: "32px",
                                border: '1px solid #B96A05',
                                background: getTrackBackground({
                                    values: values,
                                    colors: [ "#FFD08F" , "#F8A93E", "#FFD08F"],
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
                            height: "19px",
                            width: "6px",
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

export default RangeInputMinMax