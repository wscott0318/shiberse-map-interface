import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ProposalElement = styled.div`
    // border:1px solid red;
`

export const ProListItemLink = styled(Link)`
    display: flex;
    background: ${({ theme }) => theme.bgLightColor};
    gap: 1rem;
    border: 2px solid transparent;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    color: #ffa409;
    &:hover {
        border-color: #f4a817;
    }
    > div {
        width: 100%;
        align-items: center;
        &:first-child {
            align-items: flex-start;
            p {
                opacity: 0.8;
            }
        }
        p {
            text-transform: capitalize;
            &.title {
                font-size: 1.25rem;
            }
        }
    }
    flex-direction: column;
    gap: 0.25rem;
    > div {
        display: flex;
        justify-content: space-between;
    }
`
export const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1rem;
    /*@media (max-width: 1020px) {
    flex-direction: column;
  } */
`

export const Col = styled.div`
    width: 100%;
    display: flex;
    flex: auto;
    &.tabs--col {
        grid-column: span 1;
        > div {
            padding: 0;
        }
    }
`
export const Section = styled.section`
    padding: 1rem 0;
    width: 60vw;
    @media (max-width: 750px) {
        padding: 1rem 0;
        width: 100vw !important;
    }
`
export const Heading = styled.h2`
    font-size: ${({ size }) => (size ? size : '28')};
    text-align: ${({ center }) => center && 'center'};
    color: ${props => props.theme.textColor};
    max-width: ${({ size }) => (size ? '80%' : '100%')};
    margin: 0 auto;
    margin-bottom: 2rem;
    font-weight: 600;
    @media (max-width: 750px) {
        font-size: ${({ size }) => (size ? '24px' : '28px')};
        max-width: ${({ size }) => (size ? '100%' : '100%')};
    }
`
export const CardHeading = styled.h3`
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: capitalize;
`
export const Card = styled.div`
    padding: 1rem;
    background: #292733a3;
    border-radius: 10px;
    flex: 1 1 auto;
`
export const CardBody = styled.div`
    padding: 1rem 1.5rem;
    display: flex;
    padding-bottom: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
`
export const CardHead = styled.div`
    padding: 1rem 1.5rem;
    padding-bottom: 0;
    p {
        opacity: 0.7;
    }
    h3 {
        margin-bottom: 0;
        span {
            padding: 0 0.5rem;
            background: #f4a817;
            margin-left: 0.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }
    }
`
export const Address = styled.span``
export const Div = styled.div``
export const P = styled.p``
export const ProListGroup = styled.div`
    // padding:1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`
export const Status = styled.span`
    background: #f4a817;
    padding: 0.15rem 0.75rem;
    text-transform: capitalize;
    border-radius: 6px;
    display: block;
    width: fit-content;
    color: #fff;
`
