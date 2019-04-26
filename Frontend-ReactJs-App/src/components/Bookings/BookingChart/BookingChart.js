import React from 'react';

import { Bar as BarChart } from 'react-chartjs';
import './BookingChart.css';

const BOOKINGS_BUCKETS = {
    Cheap: {
        min: 0,
        max: 100
    },
    Normal: {
        min: 100,
        max: 400
    },
    Expensive: {
        min: 400,
        max: 10000000
    }
}

const bookingChart = props => {

    const barChartData = {
        labels: [],
        datasets: []
    };

    let values = [];

    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingCount = props.bookings.reduce((prev, current) => {
            if (current.event.price > BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        barChartData.labels.push(bucket);
        values.push(filteredBookingCount);
        barChartData.datasets.push(
            {
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: values
            });
        values = [...values];
        values[values.length - 1] = 0;
    }

    return <div style={{ textAlign: "center" }}>
        <BarChart data={barChartData}>Chart</BarChart>
    </div>


}

export default bookingChart;