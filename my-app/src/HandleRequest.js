import React, { useState } from 'react';
import './HandleRequest.css';

const HandleRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([
    { name: 'Alice', product: 'Widget A', quantity: 10, date: '2025-01-10', status: 'unfulfilled' },
    { name: 'Bob', product: 'Widget B', quantity: 5, date: '2025-01-12', status: 'pending' },
    { name: 'Charlie', product: 'Widget C', quantity: 20, date: '2025-01-08', status: 'fulfilled' },
  ]);

  const [filterBy, setFilterBy] = useState('name'); // Default filter option

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRequests = [...requests]
    .filter((request) => {
      if (filterBy === 'name') {
        return request.name.toLowerCase().includes(searchTerm);
      } else if (filterBy === 'date') {
        return request.date.includes(searchTerm);
      }
      return true;
    })
    .sort((a, b) => {
      if (filterBy === 'date') {
        return new Date(a.date) - new Date(b.date); // Sort from earliest to latest
      }
      return 0; // No additional sorting for other filters
    });

  const handleStatusChange = (index, newStatus) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = newStatus;
    setRequests(updatedRequests);
  };

  return (
    <div className="handle-request full-screen">
      <h1 className="page-title">Handle Request</h1>
      <div className="header">
        <input
          type="text"
          placeholder={`Search by ${filterBy}`}
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Filter by Name</option>
          <option value="date">Filter by Date</option>
        </select>
      </div>
      <div className="table-container">
        {filteredRequests.length > 0 ? (
          <table className="request-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.name}</td>
                  <td>{request.product}</td>
                  <td>{request.quantity}</td>
                  <td>{request.date}</td>
                  <td>
                    <select
                      className={`status-select status-${request.status}`}
                      value={request.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option value="unfulfilled">Unfulfilled</option>
                      <option value="pending">Pending</option>
                      <option value="fulfilled">Fulfilled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">No matching results</div>
        )}
      </div>
    </div>
  );
};

export default HandleRequest;
