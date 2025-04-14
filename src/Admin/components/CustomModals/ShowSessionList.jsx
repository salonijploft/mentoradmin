 
import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { API_BASE_URL } from '../../../Helper/apicall';
import { useParams } from 'react-router-dom';


const ShowSessionList = ({ show, handleClose, data }) => {  
    const [error, setError] = useState(null);
    console.log("data:", data)
   
  
    

    return (
        <Modal show={show} size="lg" onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Track Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error ? (
                    <div className="text-danger">
                        {error}
                    </div>
                ) : (
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Session Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data ? (
                                <tr>
                                    <td>{data.title}</td>
                                    <td>{data.description}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="2" className="text-center">
                                        No sessions available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ShowSessionList;


 