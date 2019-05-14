var chart;

/**
 * Request data from the server, add it to the graph and set a timeout
 * to request again
 */
function requestData() {
    
    var urlEncoded = encodeURI("http://twin.iab.berlin:8086/query?pretty=true&db=twin&q=select pressure from V2 where hash='virtual/SingleStage' order by time desc limit 1")
    $.ajax({
        url: urlEncoded,
        success: function(res) {
            var series = chart.series[0],
                shift = series.data.length > 20; // shift if the series is
                                                 // longer than 20

            var point = res.results[0].series[0].values[0]
            point[0] = new Date(point[0]).getTime()

            // add the point
            chart.series[0].addPoint(point, true, shift);

            // call it again after one second
            setTimeout(requestData, 1000);
        },
        cache: false
    });
}

$(document).ready(function() {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'data-container',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Value',
                margin: 80
            }
        },
        series: [{
            name: '',
            data: []
        }]
    });
});