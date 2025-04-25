import React, { useState } from "react";
import SidebarNav from "../sidebar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


const PrivacyPolicy = () => {
    const [editorData, setEditorData] = useState("");


    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };


    const handleSave = () => {
        console.log("Saved Content:", editorData);
        alert("Content saved!");
    };


    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Privacy Policy</h3>
                        </div>

                    </div>
                </div>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                />

                <button onClick={handleSave} className="mt-3 btn btn-primary">
                    Save
                </button>
            </div>
        </>
    );
};

export default PrivacyPolicy;
