import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import axios from "axios";
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { baseapi } from "../../../environment";
import { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from "@mui/material/colors";
export default function Class() {
    const [classes, setClasses] = useState([]);
    const [edit, setEdit] = useState(false);
    const [editId,setEditId] = useState(null);
    const handleEdit = (id, class_text, class_num) => {
        console.log(id)
        setEdit(true);
        setEditId(id)
        formik.setFieldValue("class_text",class_text);
         formik.setFieldValue("class_num",class_num);
    }
 const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const handleMessageClose = () => setMessage('');

    const handleDelete = (id) => {
        console.log(id)
        axios.delete(`${baseapi}/class/delete/${id}`).then(resp=>{
            setMessage(resp.data.message);
            setMessageType("success");
        }).catch(e=>{
            setMessage("Error in delete .")
            setMessageType("error")
        })
    }

    const cancelEdit = (id)=>{
        setEdit(false)
        setEditId(null)
        formik.setFieldValue("class_text","");
         formik.setFieldValue("class_num","");
    }
    
    const formik = useFormik({
        initialValues: {
            class_text: "",
            class_num: "",
        },
        validationSchema: classSchema,
        onSubmit: (values) => {
            if(edit){
                axios
                .patch(`${baseapi}/class/update/${editId}`, { ...values })
                .then((resp) => {
                    console.log("Class added:", resp.data);
                    setMessage(resp.data.message)
                    setMessageType("success")
                    cancelEdit()
                    formik.resetForm();
                    fetchAllClasses(); // refresh after adding
                })
                .catch((e) => {
                    console.log("Error in class updating", e);
                    setMessage("Error in saving")
                    setMessageType("error")
                })
            }else{
            axios
                .post(`${baseapi}/class/create`, { ...values })
                .then((resp) => {
                    console.log("Class added:", resp.data);
                    setMessage(resp.data.message)
                    setMessageType("success")
                    formik.resetForm();
                    fetchAllClasses(); // refresh after adding
                })
                .catch((e) => {
                    console.log("Error in adding class", e);
                    setMessage("Error in saving")
                    setMessageType("error")
                })
            }
        },
    });

    const fetchAllClasses = () => {
        axios
            .get(`${baseapi}/class/all`)
            .then((resp) => {
                setClasses(resp.data.data);
            })
            .catch((e) => {
                console.log("Error in fetching all classes", e);
            });
    };

    useEffect(() => {
        fetchAllClasses();
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
        

            {/* Wrapper Box */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minHeight: "100vh",
                    pt: 4,
                }}
            >
                {/* Add Class Form */}
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
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
                    >
                        {edit ? "Edit Class" : "Add New Class"}
                    </Typography>
                    <TextField
                        name="class_text"
                        label="Class Text"
                        value={formik.values.class_text}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />
                    {formik.touched.class_text && formik.errors.class_text && (
                        <p style={{ color: "red" }}>{formik.errors.class_text}</p>
                    )}

                    <TextField
                        name="class_num"
                        label="Class Number"
                        value={formik.values.class_num}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        margin="normal"
                    />
                    {formik.touched.class_num && formik.errors.class_num && (
                        <p style={{ color: "red" }}>{formik.errors.class_num}</p>
                    )}
                    
                    {/* <Button
                    onClick={()=>{
                        cancelEdit()
                    }}
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, py: 1.2, fontSize: "1rem" }}
                    >
                        Submit
                    </Button> */}
<Box sx={{ display: "flex", gap: 2, mt: 2 }}>
  <Button
    type="submit"
    variant="contained"
    sx={{ py: 1.2, fontSize: "1rem", flex: 1 }}
  >
    {edit ? "Update" : "Submit"}
  </Button>

  {edit && (
    <Button
      onClick={cancelEdit}
      color="secondary"
      variant="outlined"
      sx={{ py: 1.2, fontSize: "1rem", flex: 1 }}
    >
      Cancel
    </Button>
  )}
</Box>

                </Box>

                {/* Class List Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        px: 2,
                    }}
                >
                    {classes &&
                        classes.map((x) => (
                            <Box
                                key={x._id}
                                sx={{
                                    p: 2,
                                    border: "1px solid #ccc",
                                    borderRadius: 2,
                                    minWidth: 150,
                                    textAlign: "center",
                                    boxShadow: 3,
                                    bgcolor: "white",
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    {x.class_text}
                                </Typography>
                                <Typography variant="body2"> {x.class_num}</Typography>
                                <Box component={'div'}>
                                    <Button onClick={() => {
                                        handleEdit(x._id,x.class_text,x.class_num)
                                    }}>
                                        <EditIcon></EditIcon>
                                    </Button>
                                    <Button onClick={() => {
                                        handleDelete(x._id)
                                    }}
                                    sx={{color:"red"}}
                                    >
                                        <DeleteIcon></DeleteIcon>
                                    </Button>

                                </Box>
                            </Box>
                        ))}
                </Box>
            </Box>
        </>
    );
}
