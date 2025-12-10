import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema"; // corrected schema
import axios from "axios";
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { baseapi } from "../../../environment";
import { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const handleMessageClose = () => setMessage('');

    // Fetch all subjects
    const fetchAllSubjects = () => {
        axios
            .get(`${baseapi}/subject/all`)
            .then(resp => setSubjects(resp.data.data))
            .catch(err => console.log("Error fetching subjects:", err));
    };

    useEffect(() => {
        fetchAllSubjects();
    }, [message]);

    // Edit subject
    const handleEdit = (id, subject_name, subject_code) => {
        setEdit(true);
        setEditId(id);
        formik.setFieldValue("subject_name", subject_name);
        formik.setFieldValue("subject_code", subject_code);
    };

    // Delete subject
    const handleDelete = (id) => {
        axios.delete(`${baseapi}/subject/delete/${id}`)
            .then(resp => {
                setMessage(resp.data.message);
                setMessageType("success");
               if(editId === id){
                cancelEdit();
            }
                fetchAllSubjects();
            })
            .catch(() => {
                setMessage("Error deleting subject");
                setMessageType("error");
            });
    };

    // Cancel edit
    const cancelEdit = () => {
        setEdit(false);
        setEditId(null);
        formik.resetForm();
    };

    // Formik
    const formik = useFormik({
        initialValues: {
            subject_name: "",
            subject_code: "",
        },
        validationSchema: subjectSchema,
        validateOnBlur:false,
        validateOnChange:true,
        onSubmit: (values) => {
            if (edit) {
                // Update subject
                axios.patch(`${baseapi}/subject/update/${editId}`, values)
                    .then(resp => {
                        setMessage(resp.data.message);
                        setMessageType("success");
                        cancelEdit();
                        fetchAllSubjects();
                    })
                    .catch(err => {
                        console.log("Error updating subject:", err);
                        setMessage("Error updating subject");
                        setMessageType("error");
                    });
            } else {
                // Create new subject
                axios.post(`${baseapi}/subject/create`, values)
                    .then(resp => {
                        setMessage(resp.data.message);
                        setMessageType("success");
                        formik.resetForm();
                        fetchAllSubjects();
                    })
                    .catch(err => {
                        console.log("Error creating subject:", err);
                        setMessage("Error creating subject");
                        setMessageType("error");
                    });
            }
        }
    });

    return (
        <>
            {message && (
                <MessageSnackbar
                    message={message}
                    type={messageType}
                    handleClose={handleMessageClose}
                />
            )}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 4, minHeight: "100vh" }}>
                {/* Add/Edit Subject Form */}
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "90%",
                        maxWidth: 500,
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        boxShadow: 5,
                    }}
                    onSubmit={formik.handleSubmit}
                >
                    <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
                        {edit ? "Edit Subject" : "Add New Subject"}
                    </Typography>

                    <TextField
                        name="subject_name"
                        label="Subject Name"
                        value={formik.values.subject_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />
                    {formik.touched.subject_name && formik.errors.subject_name && (
                        <p style={{ color: "red" }}>{formik.errors.subject_name}</p>
                    )}

                    <TextField
                        name="subject_code"
                        label="Subject Code"
                        value={formik.values.subject_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />
                    {formik.touched.subject_code && formik.errors.subject_code && (
                        <p style={{ color: "red" }}>{formik.errors.subject_code}</p>
                    )}

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button type="submit" variant="contained" sx={{ flex: 1, py: 1.2 }}>
                            {edit ? "Update" : "Submit"}
                        </Button>

                        {edit && (
                            <Button onClick={cancelEdit} variant="outlined" color="secondary" sx={{ flex: 1, py: 1.2 }}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Subject List */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, px: 2 }}>
                    {subjects.map(x => (
                        <Box key={x._id} sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, minWidth: 150, textAlign: "center", boxShadow: 3, bgcolor: "white" }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{x.subject_name}</Typography>
                            <Typography variant="body2">{x.subject_code}</Typography>
                            <Box>
                                <Button onClick={() => handleEdit(x._id, x.subject_name, x.subject_code)}>
                                    <EditIcon />
                                </Button>
                                <Button onClick={() => handleDelete(x._id)} sx={{ color: "red" }}>
                                    <DeleteIcon />
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
}
