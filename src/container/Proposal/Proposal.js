import React, { useState, useEffect } from 'react'
import { SPACE, PROPOSALS, VOTES, API } from '../../graphql/config'
import { snapshotHub } from 'apollo/client'
import {
    ProListItemLink,
    ProposalElement,
    Row,
    Col,
    Card,
    CardBody,
    CardHeading,
    Heading,
    Section,
    CardHead,
    Div,
    P,
    ProListGroup,
    ProListItem,
    Status
} from './Proposal.elements'
import IsLoadingHOC from '../../helper/IsLoaderHOC'
import moment from 'moment'

// console.log('test ' + process.env.REACT_APP_SPACE)
const Proposal = props => {
    const [proposalData, setProposalData] = useState([])
    const [spaceData, setSpaceData] = useState([])
    useEffect(() => {
        spaceDatafetch()
        proposalDatafetch()
    }, [])

    const proposalDatafetch = async () => {
        const apiResult = await snapshotHub.query({
            query: PROPOSALS
        })
        const result = apiResult.data.proposals
        setProposalData(result)
        props.setLoading(false)
    }

    const spaceDatafetch = async () => {
        const apiResult = await snapshotHub.query({
            query: SPACE,
            variables: {}
        })
        const result = apiResult.data.space
        setSpaceData(result)
    }

    function trimAdd(add = '0x00', l = 5) {
        return (
            String(add).slice(0, 2) +
            String(add).slice(2, 2 + l) +
            '...' +
            String(add).slice(add.length - l, add.length)
        )
    }

    function endInDate(startDate, endDate) {
        const now = moment(new Date())
        const endTime = moment(endDate * 1000)
        const remainingDays = endTime.diff(now, 'days')
        return remainingDays
        // <>
        // <span>{remainingDays}</span>
        //     {/* <span>{startDate < endDate ? new Date( startDate*1000 ).getDay() : new Date( endDate *1000 ).getDay()}</span> */}
        // </>
    }
    return (
        <ProposalElement>
            <Section>
                {/*<Heading>{spaceData.name}</Heading>*/}
                <Row>
                    <Col style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <Card style={{ padding: 0 }}>
                            <CardHead>
                                <CardHeading>DOGGY DAO Voting</CardHeading>
                            </CardHead>

                            <CardBody>
                                <ProListGroup>
                                    {proposalData.map((item, index) => {
                                        return (
                                            <ProListItemLink
                                                to={{
                                                    pathname: `proposal/${item.id}`,
                                                    state: item
                                                }}
                                                key={item.id}
                                            >
                                                <Div>
                                                    <Div>
                                                        <P>
                                                            {item.space.name} by {trimAdd(item.author)}
                                                        </P>
                                                    </Div>
                                                    <Div>
                                                        <Status>{item.state}</Status>
                                                    </Div>
                                                </Div>
                                                <Div>
                                                    <P className="title">{item.title}</P>
                                                    <P>
                                                        {endInDate(item.start, item.end) > 0
                                                            ? 'end in ' + endInDate(item.start, item.end) + ' days'
                                                            : ''}
                                                    </P>
                                                </Div>
                                            </ProListItemLink>
                                        )
                                    })}
                                </ProListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Section>
        </ProposalElement>
    )
}

export default IsLoadingHOC(Proposal, 'Loading...')
