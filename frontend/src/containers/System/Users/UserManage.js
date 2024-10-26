import React, { useState, useEffect, useRef } from 'react';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { Scrollbars } from 'react-custom-scrollbars';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './UserManage.scss';

const UserManage = () => {
    const [arrUsers, setArrUsers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [userId, setUserId] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [pageNumber, setPageNumber] = useState(1);

    const copyButtonRef = useRef(null);
    const excelButtonRef = useRef(null);
    const pdfButtonRef = useRef(null);
    const printButtonRef = useRef(null);

    useEffect(() => {
        getAllUserFromReact();
        attachEventListeners();

        return () => detachEventListeners(); // Cleanup event listeners on unmount
    }, []);

    const attachEventListeners = () => {
        if (copyButtonRef.current) copyButtonRef.current.addEventListener('click', handleCopy);
        if (excelButtonRef.current) excelButtonRef.current.addEventListener('click', handleExportExcel);
        if (pdfButtonRef.current) pdfButtonRef.current.addEventListener('click', handleExportPDF);
        if (printButtonRef.current) printButtonRef.current.addEventListener('click', handlePrint);
    };

    const detachEventListeners = () => {
        if (copyButtonRef.current) copyButtonRef.current.removeEventListener('click', handleCopy);
        if (excelButtonRef.current) excelButtonRef.current.removeEventListener('click', handleExportExcel);
        if (pdfButtonRef.current) pdfButtonRef.current.removeEventListener('click', handleExportPDF);
        if (printButtonRef.current) printButtonRef.current.removeEventListener('click', handlePrint);
    };

    const getAllUserFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            setArrUsers(response.users);
        }
    };

    const handleAddNewUser = () => setIsOpenModal(true);

    const handleEditUser = (id) => {
        setUserId(id);
        setIsOpenEditModal(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            let response = await deleteUserService(userId);
            if (response && response.errCode === 0) {
                await getAllUserFromReact();
                alert(response.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode === 0) {
                await getAllUserFromReact();
                setIsOpenModal(false);
            } else {
                alert(response.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const editUser = async (data) => {
        try {
            let response = await editUserService(data);
            if (response && response.errCode === 0) {
                setIsOpenEditModal(false);
                await getAllUserFromReact();
            }
            alert(response.message);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCopy = () => {
        const table = document.querySelector('#table3');
        const tableData = [];
        for (let i = 0, row; row = table.rows[i]; i++) {
            const rowData = [];
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (j !== table.rows[i].cells.length - 1) {
                    rowData.push(col.innerText);
                }
            }
            tableData.push(rowData.join('\t'));
        }
        navigator.clipboard.writeText(tableData.join('\n'));
    };

    const handleExportExcel = () => {
        const table = document.querySelector('#table3');
        const tableData = [];
        for (let i = 0, row; row = table.rows[i]; i++) {
            const rowData = [];
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (j !== table.rows[i].cells.length - 1) {
                    rowData.push(col.innerText);
                }
            }
            tableData.push(rowData);
        }
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(tableData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelContent = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'user.xlsx');
    };

    const handleExportPDF = () => {
        const table = document.querySelector('#table3');
        const tableData = [];
        for (let i = 0, row; row = table.rows[i]; i++) {
            const rowData = [];
            for (let j = 0, col; col = row.cells[j]; j++) {
                if (j !== table.rows[i].cells.length - 1) {
                    rowData.push(col.innerText);
                }
            }
            tableData.push(rowData);
        }

        const doc = new jsPDF();
        doc.autoTable({
            head: [tableData[0].slice(0, -1)],
            body: tableData.slice(1).map(row => row.slice(0, -1)),
            didDrawCell: (data) => {
                data.cell.styles.fontSize = 10;
                data.cell.styles.cellPadding = 2;
                data.cell.styles.halign = 'center';
            }
        });
        doc.save('user.pdf');
    };

    const handlePrint = () => {
        const css = `
            @media print {
                #table3 td:last-child, #table3 th:last-child {
                    display: none;
                }
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        window.print();

        document.head.removeChild(style);
    };

    return (
        <Scrollbars style={{ height: "80vh" }}>
            <div className="be-content" style={{ marginTop: "-20px" }}>
                <div className="main-content container-fluid">
                    <ModalUser isOpen={isOpenModal} toggleFromParent={() => setIsOpenModal(false)} createNewUser={createNewUser} />
                    <ModalEditUser isOpen={isOpenEditModal} toggleEditFromParent={() => setIsOpenEditModal(false)} editUser={editUser} userId={userId} />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table">
                                <div className="card-header">
                                    <div className="title">Manage users</div>
                                    <button className="btn btn-primary px-3 mt-7" onClick={handleAddNewUser}><i className='fas fa-plus'></i> Add new user</button>
                                </div>
                                <div className="card-body">
                                    {/* Content for table and pagination here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Scrollbars>
    );
};

export default UserManage;
