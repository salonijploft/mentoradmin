// import React from "react";
// import { Modal, Table } from "react-bootstrap";

// function ShowPermissions({ show, handleClose,  }) {
//     const data = [
//         {
//             name: "Dashboard",
//             permissions: { view: true, create: false, update: false, delete: false },
//         },
//         {
//             name: "Mentor",
//             permissions: { view: true, create: true, update: true, delete: false },
//         },
//         {
//             name: "Mentee",
//             permissions: { view: true, create: true, update: false, delete: false },
//         },
//         {
//             name: "Bundles",
//             permissions: { view: true, create: true, update: true, delete: true },
//         },
//         {
//             name: "Categories",
//             permissions: { view: true, create: false, update: true, delete: true },
//         },
//         {
//             name: "Transactions",
//             permissions: { view: true, create: false, update: false, delete: false },
//         },
//         {
//             name: "Dispute Management",
//             permissions: { view: true, create: true, update: true, delete: false },
//         },
//         {
//             name: "Booking List",
//             permissions: { view: true, create: true, update: false, delete: true },
//         },
//         {
//             name: "Settings",
//             permissions: { view: true, create: false, update: true, delete: false },
//         },
//         {
//             name: "Reports",
//             permissions: { view: true, create: false, update: false, delete: false },
//         },
//     ];
//     return (
//         <Modal show={show} size="lg" onHide={handleClose} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Permissions</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Table bordered>
//                     <thead>
//                         <tr>
//                             <th>Module</th>
//                             <th>View</th>
//                             <th>Create</th>
//                             <th>Update</th>
//                             <th>Delete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data && data.length > 0 ? (
//                             data.map((module, index) => (
//                                 <tr key={index}>
//                                     <td>{module.name}</td>
//                                     <td>{module.permissions.view === 1 ? "✔️" : "❌"}</td>
//                                     <td>{module.permissions.create === 1 ? "✔️" : "❌"}</td>
//                                     <td>{module.permissions.update === 1 ? "✔️" : "❌"}</td>
//                                     <td>{module.permissions.delete === 1 ? "✔️" : "❌"}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" className="text-center">
//                                     No permissions available
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </Table>
//             </Modal.Body>
//         </Modal>
//     );
// }

// export default ShowPermissions;
import React from "react";
import { Modal, Table } from "react-bootstrap";

function ShowPermissions({ show, handleClose, permissions }) {
    return (
        <Modal show={show} size="lg" onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Permissions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>View</th>
                            <th>Create</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions && permissions.length > 0 ? (
                            permissions.map((permission, index) => (
                                <tr key={index}>
                                    <td>{permission.moduleName}</td>
                                    <td>{permission.isRead ? "✔️" : "❌"}</td>
                                    <td>{permission.isAdd ? "✔️" : "❌"}</td>
                                    <td>{permission.isUpdate ? "✔️" : "❌"}</td>
                                    <td>{permission.isDelete ? "✔️" : "❌"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No permissions available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
}

export default ShowPermissions;