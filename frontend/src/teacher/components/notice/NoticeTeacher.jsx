import { Box, Button, TextField, Typography, MenuItem, FormControl, InputLabel, Select, Paper } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { baseapi } from "../../../environment";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { noticeSchema } from "../../../yupSchema/noticeSchema"; // <-- You must create schema

export default function NoticeTeacher() {
    const [notices, setNotices] = useState([]);
    // const [edit, setEdit] = useState(false);
    // const [editId, setEditId] = useState(null);

    // const [message, setMessage] = useState("");
    // const [messageType, setMessageType] = useState("success");
    // const handleMessageClose = () => setMessage("");

    // const handleEdit = (id, title, message, audience) => {
    //     setEdit(true);
    //     setEditId(id);
    //     formik.setFieldValue("title", title);
    //     formik.setFieldValue("message", message);
    //     formik.setFieldValue("audience", audience);
    // };

    // const handleDelete = (id) => {
    //     axios
    //         .delete(`${baseapi}/notice/delete/${id}`)
    //         .then((resp) => {
    //             setMessage(resp.data.message);
    //             setMessageType("success");
    //         })
    //         .catch(() => {
    //             setMessage("Error deleting notice");
    //             setMessageType("error");
    //         });
    // };

    // const cancelEdit = () => {
    //     setEdit(false);
    //     setEditId(null);
    //     formik.resetForm();
    // };

    // const formik = useFormik({
    //     initialValues: {
    //         title: "",
    //         message: "",
    //         audience: "",
    //     },
    //     validationSchema: noticeSchema,
    //     onSubmit: (values) => {
    //         if (edit) {
    //             axios
    //                 .patch(`${baseapi}/notice/update/${editId}`, { ...values })
    //                 .then((resp) => {
    //                     setMessage(resp.data.message);
    //                     setMessageType("success");
    //                     cancelEdit();
    //                     fetchAllNotices();
    //                 })
    //                 .catch(() => {
    //                     setMessage("Error updating notice");
    //                     setMessageType("error");
    //                 });
    //         } else {
    //             axios
    //                 .post(`${baseapi}/notice/create`, { ...values })
    //                 .then((resp) => {
    //                     setMessage(resp.data.message);
    //                     setMessageType("success");
    //                     formik.resetForm();
    //                     fetchAllNotices();
    //                 })
    //                 .catch(() => {
    //                     setMessage("Error creating notice");
    //                     setMessageType("error");
    //                 });
    //         }
    //     },
    // });

    const fetchAllNotices = () => {
       const resp =  axios
            .get(`${baseapi}/notice/teacher`)
            
            .then((resp) => {
                setNotices(resp.data.data);
            })
            .catch((e) => console.log("Error fetching notices", e));
    };

    useEffect(() => {
        fetchAllNotices();
    }, []);

    return (
        <>
           <h1>Notice</h1>
           <Box component={'div'} sx={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
            {notices && notices.map(x=>{
                return (
                    <Paper key={x._id} sx={{m:2,p:2}}>
                        <Box component={'div'}>
                        <Typography variant="h5"><b>Title:</b>{x.title}</Typography>
                        <Typography variant="h5"><b>Message:</b>{x.message}</Typography>
                        <Typography variant="h5"><b>Audience:</b>{x.audience}</Typography>
                        </Box>

                    </Paper>
                )
            })}

           </Box>
        </>
    );
}
