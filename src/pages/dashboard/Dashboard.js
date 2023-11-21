import { useState, useEffect, useRef } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { useAuthContext } from '../../hooks/useAuthContext';
import Marquee from 'react-fast-marquee';
import constants from '../../constants/constants';

// components
import Filter from '../../components/Filter';
import QueryList from '../../components/QueryList';
// import { Doughnut } from "react-chartjs-2";

// styles
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuthContext();
  const { document, error } = useDocument('users', user.uid);
  const { document: announcement } = useDocument(
    'announcement',
    constants.ANNOUNCEMENT_ID
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [complaints, setComplaints] = useState(null);
  const [accept, setAccept] = useState(0);
  const [reject, setReject] = useState(0);
  const [pending, setPending] = useState(0);
  const chartRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const filterList = ['all', 'hostel', 'department', 'quarters', 'other'];
  const [renderChart, setRenderChart] = useState(false);

  // const ComplaintsChart = ({ data }) => {
  //   const labels = Object.keys(data);
  //   const values = Object.values(data);

  //   const totalComplaints = values.reduce((total, value) => total + value, 0);

  //   const chartData = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         data: values,
  //         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // You can customize these colors
  //         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  //       },
  //     ],
  //   };

  //   return (
  //     <div>
  //       <Doughnut
  //         ref={(chart) => (chartRef.current = chart)}
  //         data={chartData}
  //         options={{
  //           cutoutPercentage: 70, // Controls the size of the hole to make it a donut chart
  //           tooltips: {
  //             callbacks: {
  //               label: (tooltipItem, data) => {
  //                 const label = data.labels[tooltipItem.index] || '';
  //                 const value = data.datasets[0].data[tooltipItem.index] || 0;
  //                 return `${label}: ${value} (${(
  //                   (value / totalComplaints) *
  //                   100
  //                 ).toFixed(1)}%)`;
  //               },
  //             },
  //           },
  //         }}
  //       />
  //       <p style={{ textAlign: 'center' }}>Total: {totalComplaints}</p>
  //     </div>
  //   );
  // };

  useEffect(() => {
    if (document) {
      const pendingComplaints = document.complaints.filter(
        (complaint) => complaint.status === 'pending'
      );
      const acceptedComplaints = document.complaints.filter(
        (complaint) => complaint.status === 'accepted'
      );
      const rejectedComplaints =
        document.complaints.length -
        (pendingComplaints.length + acceptedComplaints.length);
      // console.log(pendingComplaints.length);
      // console.log(rejectedComplaints);
      // console.log(acceptedComplaints.length);
      // console.log(document.complaints.length);
      setPending(pendingComplaints.length);
      setAccept(acceptedComplaints.length);
      setReject(rejectedComplaints.length);
      setComplaints(pendingComplaints);
      setIsAdmin(document.adminType !== 'student');
      setRenderChart(true);
    }

    // return () => {
    //   // Destroy the chart instance to prevent canvas issues
    //   const chartInstance = chartRef.current?.chartInstance;
    //   console.log('ji');
    //   if (chartInstance) {
    //     chartInstance.destroy();
    //   }
    //   console.log('hni');
    //   chartRef.current = null;
    // };
  }, [document]);

  // const chartData = {
  //   pending: pending,
  //   accepted: accept,
  //   rejected: reject,
  // };
  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const queries = complaints
    ? complaints.filter((document) => {
        switch (filter) {
          case 'all':
            return true;
          case 'hostels':
            return (
              document.building === 'ews-bhavan' ||
              document.building === 'tagore-bhavan' ||
              document.building === 'sarabhai-bhavan' ||
              document.building === 'raman-bhavan' ||
              document.building === 'nehru-bhavan' ||
              document.building === 'narmad-bhavan' ||
              document.building === 'gajjar-bhavan' ||
              document.building === 'mother-teresa-bhavan' ||
              document.building === 'bhabha-bhavan' ||
              document.building === 'swami-bhavan'
            );
          case 'departments':
            return (
              document.building === 'cse' ||
              document.building === 'ai' ||
              document.building === 'ece' ||
              document.building === 'ee' ||
              document.building === 'me' ||
              document.building === 'ce' ||
              document.building === 'ch' ||
              document.building === 'chemistry' ||
              document.building === 'mathematics' ||
              document.building === 'physics' ||
              document.building === 'management-studies' ||
              document.building === 'humanities'
            );
          case 'ews-bhavan':
          case 'tagore-bhavan':
          case 'sarabhai-bhavan':
          case 'raman-bhavan':
          case 'nehru-bhavan':
          case 'narmad-bhavan':
          case 'gajjar-bhavan':
          case 'mother-teresa-bhavan':
          case 'bhabha-bhavan':
          case 'swami-bhavan':
          case 'cse':
          case 'ai':
          case 'ece':
          case 'ee':
          case 'me':
          case 'ce':
          case 'ch':
          case 'chemistry':
          case 'mathematics':
          case 'physics':
          case 'management-studies':
          case 'humanities':
          case 'quarters':
          case 'other':
            return document.building === filter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div className="dashboard">
      {announcement && announcement.note !== '' && (
        <Marquee pauseOnHover={true} speed={40} className="announcement">
          {announcement.note}
        </Marquee>
      )}
      {queries && (
        <Filter changeFilter={changeFilter} filterList={filterList} />
      )}
      {/* {renderChart && queries && <ComplaintsChart data={chartData} />} */}
      {queries && <QueryList queries={queries} isAdmin={isAdmin} />}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
