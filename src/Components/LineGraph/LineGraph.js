import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildCharData = (data, casesType) => {
  const charData = [];
  let lastDataPoint;
  // console.log("lastDataPoint", lastDataPoint);
  for (let date in data.cases) {
    // console.log("📅", date);
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint, //it will minus (current date cases - previous date cases)
      };
      charData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
    // console.log("lastDataPoint", lastDataPoint);
  }
  return charData;
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=130")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let charData = buildCharData(data, "cases");
          setData(charData);
          // console.log("🚀", data);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && ( //data && data.length
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(201,16,52,0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
