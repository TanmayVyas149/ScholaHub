import { Box, Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { baseapi } from "../../../environment";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { noticeSchema } from "../../../yupSchema/noticeSchema"; // <-- You must create schema

export default function Notice() {
    const [notices, setNotices] = useState([]);
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const handleMessageClose = () => setMessage("");

    const handleEdit = (id, title, message, audience) => {
        setEdit(true);
        setEditId(id);
        formik.setFieldValue("title", title);
        formik.setFieldValue("message", message);
        formik.setFieldValue("audience", audience);
    };

    const handleDelete = (id) => {
        axios
            .delete(`${baseapi}/notice/delete/${id}`)
            .then((resp) => {
                setMessage(resp.data.message);
                setMessageType("success");
            })
            .catch(() => {
                setMessage("Error deleting notice");
                setMessageType("error");
            });
    };

    const cancelEdit = () => {
        setEdit(false);
        setEditId(null);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            message: "",
            audience: "",
        },
        validationSchema: noticeSchema,
        onSubmit: (values) => {
            if (edit) {
                axios
                    .patch(`${baseapi}/notice/update/${editId}`, { ...values })
                    .then((resp) => {
                        setMessage(resp.data.message);
                        setMessageType("success");
                        cancelEdit();
                        fetchAllNotices();
                    })
                    .catch(() => {
                        setMessage("Error updating notice");
                        setMessageType("error");
                    });
            } else {
                axios
                    .post(`${baseapi}/notice/create`, { ...values })
                    .then((resp) => {
                        setMessage(resp.data.message);
                        setMessageType("success");
                        formik.resetForm();
                        fetchAllNotices();
                    })
                    .catch(() => {
                        setMessage("Error creating notice");
                        setMessageType("error");
                    });
            }
        },
    });

    const fetchAllNotices = () => {
        axios
            .get(`${baseapi}/notice/all`)
            .then((resp) => {
                setNotices(resp.data.data);
            })
            .catch((e) => console.log("Error fetching notices", e));
    };

    useEffect(() => {
        fetchAllNotices();
    }, [message]);

    return (
        <>
            {message && (
                <MessageSnackbar
                    message={message}
                    type={messageType}
                    handleClose={handleMessageClose}
                />
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: "100vh",
                    pt: 4,
                }}
            >
                {/* FORM */}
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
                        {edit ? "Edit Notice" : "Add New Notice"}
                    </Typography>

                    <TextField
                        name="title"
                        label="Notice Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />

                    {formik.touched.title && formik.errors.title && (
                        <p style={{ color: "red" }}>{formik.errors.title}</p>
                    )}

                    <TextField
                    outlined
                    rows={4}
                        name="message"
                        label="Message"
                        multiline
                        
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />

                    {formik.touched.message && formik.errors.message && (
                        <p style={{ color: "red" }}>{formik.errors.message}</p>
                    )}
                    <FormControl fullWidth sx={{ marginTop: "10px" }}>
                        <InputLabel id="demo-simple-select-label">Audience</InputLabel>
                        <Select
                            name="audience"
                            onChange={formik.handleChange}
                            onBlur={formik.handleChange}

                            value={formik.values.audience}
                            id="filled-basic" label="Audience"
                        >
                            <MenuItem value={""}>Select audience</MenuItem>
                            <MenuItem value={"teacher"}>Teacher</MenuItem>
                            <MenuItem value={"student"}>Student</MenuItem>

                        </Select>
                    </FormControl>
                    {/* <TextField
            name="audience"
            select
            label="Audience"
            value={formik.values.audience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
          </TextField>

          {formik.touched.audience && formik.errors.audience && (
            <p style={{ color: "red" }}>{formik.errors.audience}</p>
          )} */}

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                            {edit ? "Update" : "Submit"}
                        </Button>

                        {edit && (
                            <Button variant="outlined" color="secondary" sx={{ flex: 1 }} onClick={cancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Notice List */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        px: 2,
                    }}
                >
                    {notices.map((n) => (
                        <Box
                            key={n._id}
                            sx={{
                                p: 2,
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                minWidth: 200,
                                textAlign: "center",
                                boxShadow: 3,
                                bgcolor: "white",
                            }}
                        >
                            <Typography sx={{ fontWeight: "bold" }}>{n.title}</Typography>
                            <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>{n.message}</Typography>
                            <Typography sx={{ mt: 1, color: "gray" }}>
                                Audience: {n.audience}
                            </Typography>

                            <Box>
                                <Button onClick={() => handleEdit(n._id, n.title, n.message, n.audience)}>
                                    <EditIcon />
                                </Button>
                                <Button
                                    sx={{ color: "red" }}
                                    onClick={() => handleDelete(n._id)}
                                >
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
