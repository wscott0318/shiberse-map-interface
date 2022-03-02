import gql from 'graphql-tag'

//test --- testingfive.eth
//live --- shiba-swap.eth
//QmchnXUZG6zuJh3WqdvvyKW4197mca3dViEtUxgzzmVLCt
export const snapConst = require('../constants/snapshot/constants.json')
export const SPACE = gql`query {
 space(id: "${snapConst.REACT_APP_SPACE}") {
    id
    name
    about
    network
    symbol
    members
  }
}`
//author_in: ["${snapConst.REACT_APP_AUTHOR}"]
export const PROPOSALS = gql`query {
  proposals (
    first: 20,
    skip: 0,
    where: {
      space_in: ["${snapConst.REACT_APP_SPACE}"],
      author_in: ["${snapConst.REACT_APP_AUTHOR}"]
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}`
// export const VOTES = gql`
//     query {
//         votes(
//             first: 1000
//             skip: 0
//             where: { proposal: "QmchnXUZG6zuJh3WqdvvyKW4197mca3dViEtUxgzzmVLCt" }
//             orderBy: "created"
//             orderDirection: desc
//         ) {
//             id
//             voter
//             created
//             proposal {
//                 id
//             }
//             choice
//             space {
//                 id
//             }
//         }
//     }
// `
