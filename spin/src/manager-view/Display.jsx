import React from 'react';
import fakeData from './MOCK_DATA.json'
import {useTable} from 'react-table'
import Button from './Button';
import './Display.css';


export default function Display(props) {
    return (
        <div className="display-box">
            {props.view === 'inventory' ? (
                <Inventory/>
            ): props.view === 'x-report' ? (
                <XReport/>
            ): props.view === 'z-report' ? (
                <ZReport/>
            ): props.view === 'prices' ? (
                <Prices/>
            ): props.view === 'sales-report' ? (
                <SalesReport/>
            ): props.view === 'excess-report' ? (
                <ExcessReport/>
            ): props.view === 'restock-report' ? (
                <RestockReport/>
            ): props.view === 'what-sells' ? (
                <WhatSells/>
            ): (
                <h1>Welcome Manager, click a button to get started!</h1>
            )}
        </div>
    );
}

function Inventory(){
    const data = React.useMemo(() => fakeData, [])
    const columns = React.useMemo(
        () => [{
            Header: "ID",
            accessor: "id",
        }, {
            Header: "First Name",
            accessor: "first_name",
        }, {
            Header: "Last Name",
            accessor: "last_name", 
        }, {
            Header: "Email",
            accessor: "email",
        }, {
            Header: "Gender",
            accessor: "gender",
        }, {
            Header: "University",
            accessor: "university"
        }, ], 
        []
    );

    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data});

    return(
        <div>
            <h1>Inventory</h1>
            <div className='container'>
                <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                            {column.render("Header")}
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                        ))}
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
            <button className="inven">Restock</button>
        </div>

        

    )
}

function XReport(){
    return(
        <h1>X Report</h1>
    )
}

function ZReport(){
    return(
        <h1>Z Report</h1>
    )
}

function Prices(){
    return(
        <h1>Prices</h1>
    )
}

function SalesReport(){
    return(
        <h1>Sales Report</h1>
    )
}

function ExcessReport(){
    return(
        <h1>Excess Report</h1>
    )
}

function RestockReport(){
    return(
        <h1>Restock Report</h1>
    )
}

function WhatSells(){
    return(
        <h1>What Sells</h1>
    )
}