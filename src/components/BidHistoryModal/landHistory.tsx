import React, { useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { NormalButton } from 'theme'
import Loader from '../Loader'
import SortableTable from 'components/SortableTable/SortableTable'
import { shortenAddress } from 'utils'
import {DateTimeFormat} from 'helper/dateformat'

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 500;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const ConnectWalletWrapper = styled.div`
    padding: 1rem;
    text-align: center;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0;
    `};
`

const CloseIcon = styled.div`
    position: absolute;
    right: .5rem;
    top: 0;
    z-index: 10;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        stroke: ${({ theme }) => theme.text4};
    }
`

const HeaderText = styled.div`
    padding: 1rem 0;
    font-weight: 400;
    font-size: 28px;
    line-height: 42px;

    :hover {
        cursor: pointer;
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        font-size: 1.5rem !important;
        line-height: 1.7rem !important;
        margin-top: 1rem;
    `};

    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
        font-size: 1.3rem !important;
        line-height: 1.5rem !important;
        margin-top: 1rem;
    `};
`

const ContentWrapper = styled.div`
    position: relative;
`

const NoContent = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: rgb(255, 255, 255, 0.5);

    padding: 5rem 0;
    padding-top: 3rem;
`

const TableItem = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #FFFFFF;
`

export const LandBidHistoryModal = (props: any) => {
    const rows = props.allPlacedBids.map((item: any) => ({
        bidBy: `${ item.bidBy }`,
        bidAmount: `${Number(item.bidPrice).toFixed(2)} ETH`,
        dateOfBid: `${ item.createdAt ? item.createdAt : '' }`
    }))

    return (
        <Modal isOpen={ props.isOpen } onDismiss={ props.onDismiss } minHeight={false} maxHeight={80}>
            <UpperSection>
                <CloseIcon onClick={ props.onDismiss }>
                    <CloseColor />
                </CloseIcon>

                <ConnectWalletWrapper className='relative flex flex-col items-center'>
                    <>
                        <HeaderText className='text-center'>Bidding History</HeaderText>
                    </>
                </ConnectWalletWrapper>

                <ContentWrapper>
                    { !props.allPlacedBids.length 
                        ? (<NoContent>This land currently has no bidding history</NoContent> )
                        : (
                            <SortableTable 
                                title={'bid history'}
                                columns={[
                                    {
                                        key: 'bidBy',
                                        numeric: false,
                                        render: (row: any, index: any) => (
                                            <TableItem key={'bidBy' + index}><a target={'_blank'} rel="noreferrer" href={`https://etherscan.io/address/${row.bidBy}`}>{shortenAddress(row.bidBy, 7)}</a> </TableItem>
                                        ),
                                        label: 'Bid By'
                                    }, {
                                        key: 'BidAmount',
                                        render: (row: any, index: any) => (<TableItem key={'bidAmount' + index}>{ (row.bidAmount) }</TableItem>),
                                        align: 'right',
                                        label: 'Bid Price'
                                    }, {
                                        key: 'dateOfBid',
                                        render: (row: any, index: any) => (<TableItem key={'dateOfBid' + index}>{row.dateOfBid !== '' ? <DateTimeFormat data={row.dateOfBid} /> : ''}</TableItem>),
                                        align: 'right',
                                        label: 'Date of Bid'
                                    },
                                ]}
                                rows={rows}
                                rowsPerPage={5}
                            />
                        )
                    }
                </ContentWrapper>
            </UpperSection>
        </Modal>
    )
}

export default LandBidHistoryModal