import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto"; // neded to x-axis category work
import { Line, Pie } from 'react-chartjs-2';
import axios from "axios";




const Graph = () => {
  const [dates, setDates] = useState([]);
  const [status, setStatus] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(undefined);
  const [pieData, setPieData] = useState(undefined);

  const [abierto, setAbierto] = useState(0);
  const [espera, setEspera] = useState(0);
  const [cerrado, setCerrado] = useState(0);


  useEffect(() => {
    const getTicket = () => {
      setFetchStatus('loading')
      return axios
        .get("http://localhost:5000/tickets/getTicketAll", {})
        .then((response) => {

          response.data.map((item) => {
            if (item.status === 0) {
              setAbierto((prevItem) => prevItem++);
            } else if (item.status === 1) {
              setEspera((prevState) => prevState++);
            } else {
              setCerrado((prevState) => prevState++);
            }
            setDates((prevItem) => [...prevItem, new Date(item.date).toLocaleDateString()])
            setStatus((prevItem) => [...prevItem, item.status])
          })


          setFetchStatus('ok')
          return response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getTicket();

  }, [])

  useEffect(() => {
    if (fetchStatus === 'ok') {
      // llenamos los datos, y permitimos que se muestre
      setData({
        labels: dates, // Replace with your x-axis values
        datasets: [
          {
            label: 'Estado vs Tiempo',
            data: status, // Replace with your y-axis values
            fill: false, // Optional: Set to 'true' to fill below the line
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      })

      setPieData({
        labels: ['Abierto', 'Espera', 'Cerrado'],
        data: [10, 15, 100],
        datasets: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
      })

      console.log(`${abierto}, ${espera}, ${cerrado}`);

      setShowGraph(true)
    }
  }, [fetchStatus]);

  if (dates.length === 0 || status.length === 0) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (!showGraph) {
    return <h2>Cargando...</h2>
  }

  return (
    <div>


      <Line data={data} />
      <Pie data={pieData} />
    </div>);

}

export default Graph;