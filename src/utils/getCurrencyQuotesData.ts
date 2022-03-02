import {gql, GraphQLClient} from 'graphql-request'
/**
 * Contains the logic for hitting the bitquery graphql API and get currency info
 * @param baseCurrency base Currency
 * @param quoteCurrency quote Currency
 * @param startDate sate since you require the quotes
 */
 export default async function getCurrencyQuotesData(
    baseCurrency?: string, quoteCurrency?: string, startDate?: string
) {
    const curr_date = new Date()
    const past = new Date(curr_date)
    past.setDate(past.getDate()-30)

    const endpoint = 'https://graphql.bitquery.io';
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          // TODO:  MAKE .ENV
          'X-API-KEY': 'BQYR2bsviXVaT3wO9HHX8NgsN8GZsMNG',
        },
      })
    
      const query = gql`
      {
        ethereum(network: ethereum) {
          dexTrades(
            options: { limit: 30, desc: "timeInterval.hour" }
            date: { since: "${past.toISOString()}", till: "${curr_date.toISOString()}" }
            baseCurrency: { is: "${baseCurrency}" }
            quoteCurrency: { is: "0xdac17f958d2ee523a2206206994597c13d831ec7" }
          ) {
            timeInterval {
              hour(count: 1)
            }
            baseCurrency {
              symbol
              address
            }
            baseAmount
            quoteCurrency {
              symbol
              address
            }
            quoteAmount
            trades: count
            quotePrice
            maximum_price: quotePrice(calculate: maximum)
            minimum_price: quotePrice(calculate: minimum)
            open_price: minimum(of: block, get: quote_price)
            close_price: maximum(of: block, get: quote_price)
          }
        }
      }
    `

    // TODO: Handle Error cases here
    const currencyQuotesData = await graphQLClient.request(query)

    return currencyQuotesData;
    
}
