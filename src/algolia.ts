// For the search only version
import algoliasearch from 'algoliasearch/lite'

const client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID as string, process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY as string)
const index = client.initIndex(process.env.REACT_APP_ALGOLIA_INDEX_NAME as string)

export default index