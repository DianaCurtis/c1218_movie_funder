import React, { Component } from 'react';
import Chart from 'chart.js';


class Bar extends Component{
    async componentDidMount(){
        Chart.defaults.global.defaultFontColor = '#35f837';
        Chart.defaults.global.defaultFontSize = '25';
        Chart.defaults.global.defaultFontFamily = 'San-Serif';
        var ctx = document.getElementById('barChart');
        var myChart = new Chart (ctx, {
            type: 'horizontalBar',
            data: {
                labels:['Cost', 'Total Earnings'],
                datasets:[
                    {
                        label: 'Distributor Net Earning',
                        backgroundColor: ['rgba(46, 209, 190, 1)', 'rgba(27, 54, 228, 1)'],
                        data: [1, 4.8],
                       
                        
                    }
                ],
            },
            options:{
                animation:{
                    duration:1000,
                    onProgress: function( animation ){
                        onProgress.value = animation.animationObject.onAnimationProgress;
                        animateRotate: true;
                    },
                    onComplete: function (){
                        window.setTimeout(function(){
                            onProgress.value = 0;
                        }, 1000);
                    }
                
                },  
                scales:{
                    xAxes:[{
                        ticks:{
                            beginAtZero:true
                        },
                    }]
                },
                legend:{ display : false },
                title:{
                    text: 'Distributor Net Earning To Cost'
                },
                labels:{
                    fontColor:'#35f8c7',
                }
            }
         }
     )
 } 
    render(){
        return(
            <canvas id='barChart' width='200' height ='50'></canvas>
        )
    }
}

  export default Bar;



