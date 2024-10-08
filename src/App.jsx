import { useState } from 'react';
import './App.css';
import { Modal, Box } from '@mui/material';

function App() {
  let [users, setUsers] = useState([]);
  let [filtered, setFiltered] = useState([]);
  let [query, setQuery] = useState("");
  let [open, setOpen] = useState(false);
  let [user, setUser] = useState([]);
  let [hasError, setError] = useState(false);

  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  function getPaginatedData() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  function goToPage(page) {
    setCurrentPage(page);
  }
  
  function getTotalPages() {
    return Math.ceil(filtered.length / itemsPerPage);
  }

  

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: '#202020',
    border: '2px solid #000',
    color: "#FFF",
    boxShadow: 24,
    p: 4,
  };

  function sortData(column) {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      if (column === 'address') {
        aValue = a.address?.city || '';
        bValue = b.address?.city || '';
      } else if (column === 'company') {
        aValue = a.company?.name || '';
        bValue = b.company?.name || '';
      } else {
        aValue = a[column] || '';
        bValue = b[column] || '';
      }

      if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFiltered(sorted);
    setSortColumn(column);
    setSortDirection(newDirection);
  }

  function fetchData() {
    fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json()).then(json => {
      setUsers(() => json);
      setFiltered(() => json);
    }).catch((err)=> {
      setError(true);
    })
  }

  function search() {
    let queried = users.filter(user => user.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
    setFiltered(queried);
  }

  return (
    <div className="App">
      <header>
        <input type="text" onChange={(e) => {
          setQuery(e.target.value)
          console.log(query);
          search()
        }} />
        <input type="button" value="Fetch Data" onClick={fetchData} />
      </header>
      <main>
       {!hasError && <table>
          <thead>
            <tr>
              <th onClick={() => sortData('name')}>NAME {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => sortData('username')}>USERNAME {sortColumn === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => sortData('email')}>EMAIL {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => sortData('phone')}>PHONE {sortColumn === 'phone' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => sortData('address')}>CITY {sortColumn === 'address' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => sortData('company')}>COMPANY {sortColumn === 'company' && (sortDirection === 'asc' ? '▲' : '▼')}</th>
            </tr>
          </thead>
          <tbody>
          {
                getPaginatedData().map(user => (
                  <tr key={user.id} onClick={() => {
                    setUser(user);
                    setOpen(true);
                  }}>
                    <td>{user["name"]}</td>
                    <td>{user["username"]}</td>
                    <td>{user["email"]}</td>
                    <td>{user["phone"]}</td>
                    <td>{user["address"]?.city || "N/A"}</td>
                    <td>{user["company"]?.name || "N/A"}</td>
                  </tr>
                ))
              }
          </tbody>

          <div className="pagination">
            <button 
              onClick={() => goToPage(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {getTotalPages()}</span>
            <button 
              onClick={() => goToPage(Math.min(getTotalPages(), currentPage + 1))} 
              disabled={currentPage === getTotalPages()}
            >
              Next
            </button>
          </div>
          
          <Modal
            open={open && user !== undefined}
            onClose={() => { setOpen(false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {user && (
              <Box sx={style}>
                <h1>{user["name"]}</h1>
                <h2>Name: {user["name"]}</h2>
                <h2>Username: {user["username"]}</h2>
                <h2>Email: {user["email"]}</h2>
                <h2>Phone: {user["phone"]}</h2>
                <h2>Address: {user["address"]?.street || 'N/A'}, {user["address"]?.city || 'N/A'}</h2>
                <h2>Company: {user["company"]?.name || 'N/A'}</h2>
                <p>Slogan: {user["company"]?.catchPhrase || 'N/A'}</p>
                <a href={"http://" + user["website"]}>Visit Their Website!</a>
              </Box>
            )}
          </Modal>
        </table>}
        {hasError && (
          <h1>Sorry! Unable to fetch data from API</h1>
        )}
      </main>
    </div>
  );
}

export default App;
