import React from 'react';
import './css/App.css';
import Login from './components/login';
import styled from 'styled-components'
import { useTable, useFilters, useGlobalFilter } from 'react-table'
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

// style for the search bar on top
// TODO - move to a separate CSS file
const style = {
  fontSize: '20px',
  padding: '10px',
  fontWeight: 'bold',
  textAlign: 'center',
  border: '1px solid black',
  width: '750px'
  
};

const data = [
  { id: 1, vendor: 'Microsoft', address: '5000 148th Ave NE, Redmond, WA 98052', status: 'broken'},
  { id: 2, vendor: 'North Seattle College', address: '9600 College Way N, WA 98103', status: 'possible motor wear'},
  { id: 3, vendor: 'Central Seattle College', address: '539 12th Ave, Redmond, WA 98052', status: 'working'},
  { id: 4, vendor: 'Some Fun Office', address: '50 Occidental Ave S, WA 98124', status: 'broken water pipe'},
  { id: 5, vendor: 'Fidelity', address: '4600 5th Ave, Seattle, WA 980104', status: 'coffee jam'},
  { id: 6, vendor: 'Amazon Spheres', address: '5000 148th Ave NE, Redmond, WA 98052', status: 'broken dispencer'}

]
// style for the table
const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <span>
      Search:{' '}
      <input
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
          // prints target value everytime new
          console.log(e.target.value)
        }}
        placeholder={`${count} records...`}
       
        style={{
          fontSize: '1.1rem',
          border: '1',
          borderRadius: '8pt'
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter
({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
     // placeholder={`Search ${count} records...`}
    />
  )
}


function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// The table component, which displays machines
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    flatColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // Be sure to pass the defaultColumn option
      filterTypes,
    },
    //useFilters, // useFilters! - temporary removed to match wireframe
    useGlobalFilter // useGlobalFilter!
  )

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 10)

  return (
    
    <>
    <div style = {style}>
    <GlobalFilter style = {style}
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />


    </div>
    
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={flatColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
            

            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />

            
              
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  )
}

function App() { 
// columns with the top column containing the title of a table
const columns = React.useMemo(
  () => [
  { 
    // this global filter in the header doesn't word
    Header: "Machine List",
    //defaultCanFilter: true,
    canFilter: true,
    Filter: GlobalFilter,
    

    columns: [
      {
        Header: "Machine",
        accessor: "id",
      },
      {
        Header: "Vendor",
        accessor: "vendor"
      },
      {
        Header: "Address",
        accessor: "address"
      }
    ]
  },
      {
        Header: "Status",
        accessor: "status"
      }
    ]
)

// broken(filter, dispencer) - red, loud motor noise - orange, out of some type of coffee but has a different one - yellow
// working - green
//   const data = React.useMemo(() => [
//     { id: 1, vendor: 'Microsoft', address: '5000 148th Ave NE, Redmond, WA 98052', status: 'broken'},
//     { id: 2, vendor: 'North Seattle College', address: '9600 College Way N, WA 98103', status: 'possible motor wear'},
//     { id: 3, vendor: 'Central Seattle College', address: '539 12th Ave, Redmond, WA 98052', status: 'working'},
//     { id: 4, vendor: 'Some Fun Office', address: '50 Occidental Ave S, WA 98124', status: 'broken water pipe'},
//     { id: 5, vendor: 'Fidelity', address: '4600 5th Ave, Seattle, WA 980104', status: 'coffee jam'},
//     { id: 6, vendor: 'Amazon Spheres', address: '5000 148th Ave NE, Redmond, WA 98052', status: 'broken dispencer'}

// ]);

  return (
    <div className="App">
    <div className="login">
< Login />
    </div>
      <header className="App-header">     
      </header>
      <Styles>
      <Table columns={columns} data={data} />
    </Styles>
    </div>
  );
}

export default App;
