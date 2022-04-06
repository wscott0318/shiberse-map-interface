import client from '../../feathers'
import algoliaIndex from '../../algolia'

export function getAllLandData(page: number) {
    // const result = client.service('land').find()

    const result = algoliaIndex.search('', {
        hitsPerPage: 1000,
        page: page,
    })

    return result
}