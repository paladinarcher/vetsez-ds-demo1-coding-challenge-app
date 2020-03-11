import React, { useState } from 'react';
import Button from '../buttons/button';

function DataTable({data, columns, caption, pagination}) {
    const [sortKey, setSortKey] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);

    if (!data || !columns) {
        console.warn('All required props not given to this component');
        return null;
    }  
    
    function gotoPreviousPage() {
        if(currentPage > 1) {
            setCurrentPage(currentPage-1);
        }
    }
 
    function gotoNextPage() {
        if(currentPage < Math.ceil(data.length / rowsPerPage)) {
            setCurrentPage(currentPage+1);
        }
    }

    function gotoPageNumber(pageNumber) {
        setCurrentPage(pageNumber);
    }

    const renderSortedRows = function() {
        let thisData = [...data];

        if(sortKey !== "") {
            thisData.sort((a,b) => (a[sortKey] > b[sortKey]) ? 1 : ((b[sortKey] > a[sortKey]) ? -1 : 0));
        }

        return(
            <React.Fragment>
            { thisData.map((row, rowIndex) => { 
                return (!pagination || (rowIndex >= (currentPage-1) * rowsPerPage && rowIndex < currentPage * rowsPerPage) ?
                    <tr key={rowIndex}>
                        { columns.map((column, colIndex) => { return (
                            <td key={colIndex}>{row[column.key]}</td>
                        )})} 
                    </tr>
                : null);
            })} 
            </React.Fragment>
        );
    } 

    const renderPageButtons = function() {
        let pageButtons = new Array();

        for(let i=1; i<=Math.ceil(data.length / rowsPerPage); i++) {
            pageButtons.push(<a key={i} aria-label={"Go to page " + i} role="button" tabIndex="0" onClick={() => gotoPageNumber(i)}>{i}</a>);
        }

        return (<React.Fragment>{ pageButtons }</React.Fragment>);
    }
    
    return (
        <React.Fragment>
            <table>
                { caption ? <caption>{caption}</caption> : null }
                <thead>
                    <tr>
                        { columns.map((column, index) => { return (
                            <th scope="col" key={index} onClick={() => setSortKey(column.key)} className="sortable" aria-sort={column.key === sortKey ? "ascending" : "none"}>{column.name}{column.key === sortKey ? <span>&nbsp;&nbsp;<i className="fas fa-chevron-down"></i></span> : null}</th>                        
                        )})}  
                    </tr>
                </thead>
                <tbody>
                    { renderSortedRows() }
                </tbody>
            </table>
            <div className="va-pagination">
                <span className="va-pagination-prev">
                    <a aria-label="Go to previous page in table" role="button" tabIndex="0" onClick={gotoPreviousPage}>Previous</a>
                </span>
                <div className="va-pagination-inner">
                    { renderPageButtons() }
                </div>
                <span className="va-pagination-next">
                    <a aria-label="Go to next page in table" role="button" tabIndex="0" onClick={gotoNextPage}>Next</a>
                </span>
            </div>
        </React.Fragment>
    );
}

export default DataTable;
