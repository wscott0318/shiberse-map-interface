import React from 'react';
import ReactECharts from 'echarts-for-react';





function Chart(props: any ) {
    return (
        <>
            <ReactECharts
                option={props.options}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
            />
            
        </>
    )
}

export default Chart;