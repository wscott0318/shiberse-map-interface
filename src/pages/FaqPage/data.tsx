
const questions = [
    {
      id: 1,
      title: 'What is a DEX?',
      info:
        'DEX is a short of Decentralized Exchange. It is an online platform which connect users directly, so they can trade cryptocurrencies with one another without trustingan intermediary with their money.',
    },
    {
      id: 2,
      title: 'What are the Liquidity Pools?',
      info:
        'In order to trade cryptocurrencies, there must be adequate supply. If not, there won’t be enough tokens to buy or sell.',
      extra_details: {
        info_p1: 'CEX (Centralized Exchanges) facilitate trades, but that’s vesting too much control on those entities, which increases the risk of manipulation in their favour.',
        info_p2: 'On the contrary, DExs use Liquidity Pools.',
        info_p3: 'Liquidity Pools are basically smart contracts where multiple providers ‘pool’ their assets to generate liquidity in a proportional amount of asset pairs (i.e. SHIB-ETH).',
        info_p4: 'Liquidity providers, are incentivized to contribute equal proportions of both assets, receiving in exchange determinated rewards.',
        info_p5: 'Example: Woofy has ETH and wants to swap it for SHIB. Thanks to the liquidity added by the people to the SHIB-ETH pool, Woofy will be able to add liquidity to the ETH end of the pair and withdraw an equivalent amount of SHIB. '
      }
    },
    {
      id: 3,
      title: 'What is the Impermanent Loss?',
      info:
        'The Impermanent Loss happens when you provide liquidity to a liquidity pool, and the price of your deposited assets changes compared to when you deposit them. The bigger the change is, the more you are exposed to IL.',
        extra_details: {
          info_p1: 'Then, you might me wondering why people still provide liquidity if they’re exposed to potential losses?',
          info_p2: 'Impermanent Loss can be countered by trading fees and the rewards received during that time you are providing liquidity.',
          info_p3: 'Also, it’s important to note that Impermanent Loss is ‘impermanent’ because token values can revert and you would be able to accumulate the fees and rewards during that duration without impact on your initial deposit.'
        }
    },
    {
      id: 4,
      title: 'What are Gas fees?',
      info:
        'Gas fees are the charges that Ethereum miners receive to process transactions on the blockchain. They are paid with ETH and calculated in Gwei. The more transactions going through the blockchain, the higher the gas fees.',
    },
    {
      id: 5,
      title: 'What is the TVL?',
      info:
        'TVL is a short of Total Value Locked, which means the amount of money that a DEX is holding inside it. It’s often used as a measure of success in a platform.',
    },
    {
      id: 6,
      title: 'What is staking?',
      info:
        'Staking is the action of sending a certain amount of tokens into a smart contract. This amount is then locked in this contract until you unstake it. In exchange to this action, users are rewarded with concrete assets. It reduces circulating supply (while it’s locked in smart contracts), help the project increase their TVL in the rankings, etc.',
    },{
      id: 7,
      title: 'What is an LP token?',
      info:
        'LP tokens are “liquidity provider tokens”, and they are used by DEX as a proof you own a share of the pool liquidity. When you contribute assets to a pool, these assets are accounted into this token and you are sent this LP so you can later redeem it for your share. It also helps to receive rewards during the time you are providing liquidity on a pool.',
    },
    {
      id: 8,
      title: 'Getting started',
      info:
        'Being able to use ShibaSwap is pretty simple. We don’t need you to create an account due to the decentralization of the platform.',
        extra_details: {
          info_p1: 'To use ShibaSwap you just to connect a wallet (MetaMask or Coinbase Wallet for now) which contains ETH to execute transactions.',
          info_p2: 'If you don’t have ETH you will need to purchase from any exchange and send it to your wallet address.',
        }
    },
    {
      id: 9,
      title: 'How I provide liquidity (DIG) to ShibaSwap?',
      info:
        'To provide liquidity in any pool, you need to go to DIG through the home menu.',
        extra_details: {
          info_p1: `Once there, you will decide if you want to add liquidity to an existing pair or create your own.
          Remember: just allocated pairs (shown at WOOF Pairs list or WoofPaper) are eligible to receive BONE and Woof Returns (WBTC, DAI, USDC and USDT). If you create your own pair, you will receive a percentage of all swap fees transactions.`,
          info_p2: 'Once you are on the liquidity provider module, you must select two assets and provide liquidity for them. If the pair already exists, pair amounts will be automatically set once you select the amount you want to provide for any of both assets.',
          info_p3: 'Then, you will need to approve the assets (which requires a certain transaction fee) and supply liquidity',
          info_p4: 'You will receive LP tokens (SSLP) on your wallet that represents your share of the pool.',
          info_p5: 'If you want how to receive allocated rewards for that pair, please, go to “How to earn liquidity rewards”.',
        }
    },{
      id: 10,
      title: 'How to earn liquidity rewards (WOOF)?',
      info:
        'Once you have received SSLP (ShibaSwap Liquidity Provider) tokens, you are able to deposit them and start receiving rewards.',
        extra_details: {
          info_p1: 'Go to WOOF through the home menu, and select on the list the pair you have provided liquidity on the pools.',
          info_p2: 'You will be able to deposit your SSLP tokens there and you will be receiving rewards over time. You can withdraw your deposited LPs at any time, if needed.',
        }
    }
  ]
  export default questions