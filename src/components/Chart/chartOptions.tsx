import * as echarts from 'echarts/core'


function removeTrailingZero(value: number | string) {
    value = value.toString()
    if (value.indexOf('.') === -1) {
      return value
    }
    let cutFrom = value.length - 1
    do {
      if (value[cutFrom] === '0') {
        cutFrom--
      }
    } while (value[cutFrom] === '0')
    if (value[cutFrom] === '.') {
      cutFrom--
    }

    return value.substr(0, cutFrom + 1)
  }


export function prepareLineChartOptions(data: any) {
    
    const linesData = [] as any

    data.ethereum.dexTrades.forEach((e: any) => {
      linesData.push([new Date(e.timeInterval.hour), e.quotePrice])
    })

    return {
    grid: {
      left: '2%',
      top: '20%',
      right: '8%',
      bottom: '9%',
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#4e547d',
          width: 1.5,
        },
      },
      axisTick: {
        show: true,
        length: 4,
        lineStyle: {
          color: '#4e547d',
        },
      },
      axisLabel: {
        color: '#fff',
        fontSize: '10',
        opacity: 0.8,
        formatter: (value: number, index: number) => {
          if (index === 1) {
            return ''
          } else {
            return `{HH}`
          }
        },
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      position: 'right',
      splitNumber: 5,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#4e547d',
          width: 1.5,
        },
      },
      axisTick: {
        show: true,
        length: 4,
        lineStyle: {
          color: '#4e547d',
        },
      },
      axisLabel: {
        color: '#fff',
        fontSize: '10',
        opacity: 0.8,
        formatter: (value: number) => {
          const stringValue = String(
            removeTrailingZero(value.toFixed(20))
          )
          if (stringValue.length > 4) {
            return '..' + stringValue.substr(-2)
          }
          return value
        },
      },
      splitLine: {
        show: false,
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#ffa50bd9',
          type: 'dotted',
          opacity: 0.5,
        },
        label: {
          backgroundColor: '#ffa50bd9',
        },
      },
    },
    series: [
      {
        type: 'line',
        smooth: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#ffa50bd9',
            },
            {
              offset: 1,
              color: '#171a27',
            },
          ]),
        },
        symbol: 'none',
        lineStyle: {
          color: '#ffa50b',
          width: 1,
        },
        data: linesData,
      },
    ],
  }
}

export function prepareCandleChartOptions(data: any) {
    const candlesData: any[] = []
    data.ethereum.dexTrades.forEach((e: any) => {
      candlesData.push([
        e.open_price,
        e.close_price,
        e.minimum_price,
        e.maximum_price,
      ])
    })

    return {
      grid: {
        left: '2%',
        top: '20%',
        right: '8%',
        bottom: '9%',
      },
      xAxis: {
        data: data.ethereum.dexTrades.map((e: any) => {
          return e.timeInterval.hour.split(' ')[1].split(':')[0]
        }),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#4e547d',
            width: 1.5,
          },
        },
        axisTick: {
          show: true,
          length: 4,
          lineStyle: {
            color: '#4e547d',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: '10',
          opacity: 0.8,
          interval: 3,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        position: 'right',
        splitNumber: 5,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#4e547d',
            width: 1.5,
          },
        },
        axisTick: {
          show: true,
          length: 4,
          lineStyle: {
            color: '#4e547d',
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: '10',
          opacity: 0.8,
          formatter: (value: number) => {
            const stringValue = String(
              removeTrailingZero(value.toFixed(20))
            )
            if (stringValue.length > 4) {
              return '..' + stringValue.substr(-2)
            }
            return value
          },
        },
        splitLine: {
          show: false,
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#ffa50bd9',
            type: 'dotted',
            opacity: 0.5,
          },
          label: {
            backgroundColor: '#ffa50bd9',
          },
        },
      },
      series: [
        {
          type: 'k',
          smooth: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#ffa50bd9',
              },
              {
                offset: 1,
                color: '#171a27',
              },
            ]),
          },
          symbol: 'none',
          lineStyle: {
            color: '#ffa50b',
            width: 1,
          },
          data: candlesData,
        },
      ],
    }
}