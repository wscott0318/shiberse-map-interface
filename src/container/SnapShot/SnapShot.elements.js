import styled from 'styled-components'
import { Link } from 'react-router-dom'
// import { TokenTypeGroup, TokenTypeItem, TokenTypeLabel } from "../NewToken/NewToken.elements";
export const Row = styled.div`
    display: flex;
    gap: 1rem;
`
export const TokenTypeLabel = styled.div``
export const TokenTypeIcon = styled.div``
export const TokenTypeItem = styled.div`
    background: ${({ theme }) => theme.bgLightColor};
    flex: auto;
    border: 2px solid transparent;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    &:hover {
        border-color: #f4a817;
    }
    &.active {
        border-color: #f4a817;
    }
`
export const TokenTypeGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin: 2rem 0;
`
export const Col = styled.div`
    flex: 1 1 auto;
    &.tabs--col {
        max-width: 400px;
        width: 100%;
        > div {
            padding: 0;
        }
    }
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

export const ListGroup = styled.div`
    // padding:1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

export const ListItem = styled.div`
    display: flex;
    background: ${({ theme }) => theme.bgLightColor};
    gap: 1rem;
    border: 2px solid transparent;
    padding: 0.75rem 1rem;
    border-radius: 10px;
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
`
export const Address = styled(Link)`
    display: flex;
    background: ${({ theme }) => theme.bgLightColor};
    gap: 1rem;
    border: 2px solid transparent;
    padding: 0.75rem 1rem;
    border-radius: 10px;

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
export const Div = styled.div``
export const P = styled.p``

export const ProListGroup = styled(ListGroup)``
export const ProListItem = styled(ListItem)`
    flex-direction: column;
    gap: 0.25rem;
    > div {
        display: flex;
        justify-content: space-between;
    }
`
export const CardBody = styled.div`
    padding: 1rem 1.5rem;
    display: flex;
    padding-bottom: 1.5rem;
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
`
export const Select = styled(TokenTypeGroup)``
export const Option = styled(TokenTypeItem)`
    display: flex;
    border-radius: 6px;
    justify-content: center;
`
export const OptionLabel = styled(TokenTypeLabel)`
    text-align: center;
    text-transform: capitalize;
`
export const Progress = styled.div`
    width: 150px;
    height: 150px;
    margin: 0 auto;
    h2 {
        font-size: 1rem;
        font-weight: 300;
        margin: 0;
        opacity: 0.7;
        &:first-child {
            font-size: 1.75rem;
            opacity: 1;
        }
    }
`
export const ActiveButton = styled.button`
    background: linear-gradient(115.09deg, #f4a817 0%, #fb441e 100%);
    backdrop-filter: blur(50px);
    padding: 0.85rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    &:hover {
        background: linear-gradient(115.09deg, #f4a817 20%, #fb441e 100%);
    }
`
export const CardHeading = styled.h3`
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    text-transform: capitalize;
`
