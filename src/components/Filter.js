import { useState } from 'react';

// styles
import './Filter.css';

export default function QueryFilter({ changeFilter, filterList, type }) {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  const [nestedFilter, setNestedFilter] = useState(null);

  const handleClick = (e) => {
    const newFilter = e.target.value;
    setCurrentFilter(newFilter);
    setIsNestedOpen(newFilter === 'hostel' || newFilter === 'department');
    setNestedFilter(newFilter === 'hostel' ? 'hostels' : 'departments');

    if (newFilter === 'hostel') {
      changeFilter('hostels');
    } else if (newFilter === 'department') {
      changeFilter('departments');
    } else {
      changeFilter(newFilter);
    }
  };

  const handleNestedClick = (e) => {
    const newNestedFilter = e.target.value;
    setNestedFilter(newNestedFilter);
    changeFilter(newNestedFilter);
  };

  return (
    <div className="filter">
      <label htmlFor="filterSelect">Filter by {type} : </label>
      <select id="filterSelect" value={currentFilter} onChange={handleClick}>
        {filterList.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      {currentFilter === 'hostel' && isNestedOpen && (
        <div className="nested-dropdown">
          <select value={nestedFilter} onChange={handleNestedClick}>
            <option value="hostels">All Hostels</option>
            <option value="swami-bhavan">Swami Bhavan</option>
            <option value="bhabha-bhavan">Bhabha Bhavan</option>
            <option value="gajjar-bhavan">Gajjar Bhavan</option>
            <option value="mother-teresa-bhavan">Mother Teresa Bhavan</option>
            <option value="narmad-bhavan">Narmad Bhavan</option>
            <option value="nehru-bhavan">Nehru Bhavan</option>
            <option value="raman-bhavan">Raman Bhavan</option>
            <option value="sarabhai-bhavan">Sarabhai Bhavan</option>
            <option value="tagore-bhavan">Tagore Bhavan</option>
            <option value="ews-bhavan">EWS hostel</option>
            {/* Add more options for hostels as needed */}
          </select>
        </div>
      )}
      {currentFilter === 'department' && (
        <select value={nestedFilter} onChange={handleNestedClick}>
          <option value="departments">All Departments</option>
          <option value="cse">CSE</option>
          <option value="ai">AI</option>
          <option value="ece">ECE</option>
          <option value="ee">EE</option>
          <option value="me">ME</option>
          <option value="ce">CE</option>
          <option value="ch">CH</option>
          <option value="chemistry">Chemistry</option>
          <option value="mathematics">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="management-studies">Management Studies</option>
          <option value="humanities">Humanities </option>
          {/* Add more options for departments as needed */}
        </select>
      )}
    </div>
  );
}
