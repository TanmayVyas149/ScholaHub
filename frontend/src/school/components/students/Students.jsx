// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import TextField from '@mui/material/TextField';
// import CardMedia from '@mui/material/CardMedia';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import { baseapi } from "../../../environment";
// import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';

// import bgImage from '../../../../src/assets/background_img.jpg';
// import { useState, useEffect } from 'react';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import { studentSchema,studentEditSchema } from '../../../yupSchema/studentSchema';
// export default function Students() {
//     const [edit,setEdit] = useState(false)
//     const [editId,setEditId] = useState(null)
//     const [classes,setClasses] = useState([])

//     const [file, setFile] = React.useState(null);
//     const [imageUrl, setImageUrl] = React.useState(null);
//     const [message, setMessage] = React.useState('');
//     const [messageType, setMessageType] = React.useState('success');

//     const fileInputRef = React.useRef(null);
// const handleEdit = (id) => {
//   setEdit(true);
// setEditId(id)
//   const student = students.find(x => x._id === id);

//   Formik.setFieldValue("email", student.email);
//   Formik.setFieldValue("name", student.name);
//   // Formik.setFieldValue("student_class", student.student_class?._id || "");
//   Formik.setFieldValue("student_class", student.student_class._id);

//   Formik.setFieldValue("age", student.age);
//   Formik.setFieldValue("gender", student.gender);
//   Formik.setFieldValue("guardian", student.guardian);
//   Formik.setFieldValue("guardian_phone", student.guardian_phone);
//     setImageUrl(`/images/uploaded/student/${student.student_image}`)
//     setFile(null);
//   if (fileInputRef.current) fileInputRef.current.value = "";
// };


//    const handleDelete = (id) => {
//   if (confirm("Are you sure you want to delete ?")) {
//     axios
//       .delete(`http://localhost:5000/api/student/delete/${id}`)
//       .then((resp) => {
//         console.log(resp);
//         setMessage(resp.data.message);
//         setMessageType("success");
//       })
//       .catch((e) => {
//         setMessage("Error in creating new student.");
//         setMessageType("error");
//         console.log("Error", e);
//       });
//   }
// };   // ← THIS is the correct closing

//     const addImage = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setImageUrl(URL.createObjectURL(file));
//             setFile(file);
//         }
//     };

//     const handleClearFile = () => {
//         if (fileInputRef.current) fileInputRef.current.value = '';
//         setFile(null);
//         setImageUrl(null);
//     };
//     const cancelEdit = ()=>{
//     //  setClasses(false);
//       setEdit(false)
//       setEditId(null)
//       Formik.resetForm;
//     }
//     const initialValues = {
//         name: "",
//         email: "",
//         student_class: "",
//         age: "",
//         gender: "",
//         guardian: "",
//         guardian_phone: "",
//         password: "",
//         confirm_password: "",
//     };

//     const Formik = useFormik({
//         initialValues,
//         validationSchema: edit?studentEditSchema:studentSchema,
//         onSubmit: (values) => {
//             console.log("Register submit value", values);
//           if(edit){
//             const fd = new FormData();
//             fd.append("name", values.name);
//                 fd.append("email", values.email);
//                 fd.append("student_class", values.student_class);
//                 fd.append("age", values.age);
//                 fd.append("gender", values.gender);
//                 fd.append("guardian", values.guardian);
//                 fd.append("guardian_phone", values.guardian_phone);
//                // fd.append("password", values.password);
//             if(file){
//                      fd.append("image", file, file.name);
//             }
//             if(values.password){
//               fd.append('password',values.password)
//             }
//             axios.patch(`http://localhost:5000/api/student/update/${editId}`, fd)
//                     .then(resp => {
//                         console.log(resp);
//                         setMessage(resp.data.message);
//                         setMessageType('success');
//                         Formik.resetForm();
//                           Formik.setFieldValue("student_class", "");
//                         handleClearFile();
//                     })
//                     .catch(e => {
//                         setMessage("Error in creating new student");
//                         setMessageType('error');
//                         console.log("Error", e);
//                     });
//           }else{
//             if (file) {
//                 const fd = new FormData();
//                 fd.append("image", file, file.name);
//                 fd.append("name", values.name);
//                 fd.append("email", values.email);
//                 fd.append("student_class", values.student_class);
//                 fd.append("age", values.age);
//                 fd.append("gender", values.gender);
//                 fd.append("guardian", values.guardian);
//                 fd.append("guardian_phone", values.guardian_phone);
//                 fd.append("password", values.password);

//                 axios.post('http://localhost:5000/api/student/register', fd)
//                     .then(resp => {
//                         console.log(resp);
//                         setMessage(resp.data.message);
//                         setMessageType('success');
//                         Formik.resetForm();
//                           Formik.setFieldValue("student_class", "");
//                         handleClearFile();
//                     })
//                     .catch(e => {
//                         setMessage("Error in creating new student");
//                         setMessageType('error');
//                         console.log("Error", e);
//                     });
//             } else {
//                 setMessage('Please Add School image');
//                 setMessageType('error');
//             }
//         }
//       }
//     });

//     const handleMessageClose = () => {
//         setMessage('');
//     }
//     // const fetchClasses = () =>{
//     //     axios.get(`${baseapi}/class/all`).then(resp=>{
//     //         setClasses(resp.data.data)
//     //     }).catch(e=>{
//     //         console.log("Error in fetching classes")
//     //     })
//     // }
//     const fetchClasses = () => {
//   axios.get(`${baseapi}/class/all`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   })
//   .then(resp => {
//     setClasses(resp.data.data);
//   })
//   .catch(e => {
//     console.log("Error in fetching classes", e);
//   });
// };

//     const [params,setParams] = useState({});
//     const handleClass = (e)=>{
//         setParams((prevParams)=>({
//             ...prevParams,
//             student_class: e.target.value || undefined,
//         }))
//     }
//     const handleSearch = (e)=>{
//         setParams((prevParams)=>({
//             ...prevParams,
//             search: e.target.value || undefined,
//         }))
//     }
//     const [students,setStudents] = useState([])
//     // const fetchStudents = () =>{
//     //     axios.get(`${baseapi}/student/fetch-with-query`,{params}).then(resp=>{
//     //         console.log("response student",resp)
//     //         setStudents(resp.data.students)
//     //     }).catch(e=>{
//     //         console.log("Error in fetching classes",e)
//     //     })
//     // }
//     const fetchStudents = () => {
//     const token = localStorage.getItem("token");

//     axios.get(`${baseapi}/student/fetch-with-query`, {
//         params,
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })
//     .then(resp => {
//         console.log("response student", resp)
//         setStudents(resp.data.students)
//     })
//     .catch(e => {
//            console.log("Backend Error:", e.response?.data || e.message);
//     });
// }
// useEffect(()=>{
//    fetchClasses();
// },[])
//     useEffect(()=>{
       
//         fetchStudents();
//     },[message, params])

//    return (
//   <Box
//     sx={{
//       minHeight: "100vh",
//       display: "flex",
//       flexDirection: "column", // make elements stack vertically
//       alignItems: "center",
//       justifyContent: "flex-start",
//       gap: "4px", // spacing between Register box and Search box
//       py: 4,
//     }}
//   >
//     {message && (
//       <MessageSnackbar
//         message={message}
//         type={messageType}
//         handleClose={handleMessageClose}
//       />
//     )}

//     {/* ---------- Register Student Box ---------- */}
//     <Box
//       component="form"
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         width: "90%",
//         maxWidth: 500,
//         p: 4,
//         borderRadius: 3,
//         bgcolor: "rgba(255, 255, 255, 0.9)",
//         boxShadow: 5,
//       }}
//       onSubmit={Formik.handleSubmit}
//     >
//       {edit? <Typography variant="h5" textAlign="center" mb={2}>
//         Edit Student
//       </Typography>:
//       <Typography variant="h5" textAlign="center" mb={2}>
//         Add new Student
//       </Typography>
//       }
    

//       <Typography variant="body1">Add Student Image</Typography>
//       <TextField type="file" inputRef={fileInputRef} onChange={addImage} />

//       {imageUrl && (
//         <CardMedia
//           component="img"
//           image={imageUrl}
//           height="200"
//           sx={{ borderRadius: 2, objectFit: "cover", mt: 1 }}
//         />
//       )}

//       <TextField
//         name="name"
//         label="Name"
//         value={Formik.values.name}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.name && Formik.errors.name && (
//         <p style={{ color: "red" }}>{Formik.errors.name}</p>
//       )}

//       <TextField
//         name="email"
//         label="Email"
//         value={Formik.values.email}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.email && Formik.errors.email && (
//         <p style={{ color: "red" }}>{Formik.errors.email}</p>
//       )}

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Student Class</InputLabel>
//         {/* <Select
//           value={params.student_class}
//           label="Student Class"
//           name="student_class"
//           onChange={Formik.handleChange}
//         >
//           {classes &&
//             classes.map((x) => (
//               <MenuItem key={x._id} value={x._id}>
//                 {x.class_text} ({x.class_num})
//               </MenuItem>
//             ))}
//         </Select> */}
//         <Select
//   name="student_class"
//   value={Formik.values.student_class}
//   label="Student Class"
//   onChange={(e) => Formik.setFieldValue("student_class", e.target.value)}
// >
//   {classes.map((x) => (
//     <MenuItem key={x._id} value={x._id}>
//       {x.class_text} ({x.class_num})
//     </MenuItem>
//   ))}
// </Select>

//       </FormControl>

//       {Formik.touched.student_class && Formik.errors.student_class && (
//         <p style={{ color: "red" }}>{Formik.errors.student_class}</p>
//       )}

//       <TextField
//         name="age"
//         label="Age"
//         value={Formik.values.age}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.age && Formik.errors.age && (
//         <p style={{ color: "red" }}>{Formik.errors.age}</p>
//       )}

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Gender</InputLabel>
//         <Select
//           value={Formik.values.gender}
//           label="Gender"
//           name="gender"
//           onChange={Formik.handleChange}
//         >
//           <MenuItem value={"male"}>Male</MenuItem>
//           <MenuItem value={"female"}>Female</MenuItem>
//           <MenuItem value={"others"}>Others</MenuItem>
//         </Select>
//       </FormControl>
//       {Formik.touched.gender && Formik.errors.gender && (
//         <p style={{ color: "red" }}>{Formik.errors.gender}</p>
//       )}

//       <TextField
//         name="guardian"
//         label="Guardian Name"
//         value={Formik.values.guardian}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.guardian && Formik.errors.guardian && (
//         <p style={{ color: "red" }}>{Formik.errors.guardian}</p>
//       )}

//       <TextField
//         name="guardian_phone"
//         label="Guardian Phone"
//         value={Formik.values.guardian_phone}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.guardian_phone && Formik.errors.guardian_phone && (
//         <p style={{ color: "red" }}>{Formik.errors.guardian_phone}</p>
//       )}

//       <TextField
//         name="password"
//         type="password"
//         label="Password"
//         value={Formik.values.password}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.password && Formik.errors.password && (
//         <p style={{ color: "red" }}>{Formik.errors.password}</p>
//       )}

//       <TextField
//         name="confirm_password"
//         type="password"
//         label="Confirm Password"
//         value={Formik.values.confirm_password}
//         onChange={Formik.handleChange}
//         onBlur={Formik.handleBlur}
//         margin="normal"
//       />
//       {Formik.touched.confirm_password && Formik.errors.confirm_password && (
//         <p style={{ color: "red" }}>{Formik.errors.confirm_password}</p>
//       )}

//       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//         <Button type="submit" variant="contained" sx={{ py: 1.2, fontSize: "1rem" }}>
//           Submit
//         </Button>
//         {/* <Button
//           type="button"
//           variant="outlined"
//           sx={{ py: 1.2, fontSize: "1rem", width: "48%" }}
//           onClick={() => {
//             Formik.resetForm();
//               Formik.setFieldValue("student_class", "");
//             handleClearFile();
//           }}
//         >
//           Cancel
//         </Button> */}
//         <Button
//   type="button"
//   variant="outlined"
//   onClick={() => {
//     Formik.resetForm();
//     handleClearFile();
//     setEdit(false);
//     setEditId(null);
//   }}
// >
//   Cancel
// </Button>

//       </Box>
//     </Box>

//     {/* ---------- Search and Class Filter Box ---------- */}
//     <Box
//       sx={{
//         display: "flex",
//         gap: 2,
//         alignItems: "center",
//         justifyContent: "center",
//         mt: 3,
//         flexWrap: "wrap",
//       }}
//     >
//       <TextField
//         label="Search"
//         value={params.search?params.search:""}
//         variant="outlined"
//         size="small"
//         onChange={(e) => handleSearch(e)}
//       />

//       <FormControl size="small" sx={{ minWidth: 200 }}>
//         <InputLabel>Student Class</InputLabel>
//         {/* <Select
//         name="student_class"
//          label="Student Class"
//         //  value={params.student_class ? params.student_class : ""} 
//          value={Formik.values.student_class || ""}
//          onChange={(e) => handleClass(e)}
//          >
//           <MenuItem value="">Select Class</MenuItem>
//           {classes &&
//             classes.map((x) => (
//               <MenuItem key={x._id} value={x._id}>
//                 {x.class_text} ({x.class_num})
//               </MenuItem>
//             ))}
//         </Select> */}
//         {/* <Select
//     name="student_class"
//     label="Student Class"
//     value={Formik.values.student_class || ""}
//     onChange={(e) => Formik.setFieldValue("student_class", e.target.value)}
   
// >
//     {classes.map((item) => (
//         <MenuItem key={item._id} value={item._id}>
//             {item.class_name}
//         </MenuItem>
//     ))}
// </Select> */}
//  <Select
//     name="student_class"
//     label="Student Class"
//     value={Formik.values.student_class || ""}
//     onChange={Formik.handleChange}
//   >
//     {classes.map((x) => (
//       <MenuItem key={x._id} value={x._id}>
//         {x.class_text} ({x.class_num})
//       </MenuItem>
//     ))}
//   </Select>

//       </FormControl>
// {/* 
//       <Button variant="contained" onClick={fetchStudents}>
//         Search
//       </Button> */}
//     </Box>
//     <Box
//      component={'div'} 
//      sx={{
//    display: "flex",
//     flexWrap: "wrap",     
//     gap: 3,               
//     justifyContent: "flex-start", 
//     width: "90%",
//     maxWidth: "1200px",
//     mt: 5,
//        }}>
//             {students && students.map(student=>{
//                 return(
//      <Card key={student._id} sx={{ maxWidth: 345 }}>
//       <CardMedia
//         sx={{ height: 340 }}
//       image={`/images/uploaded/student/${student.student_image}`}
        
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//          <span style={{fontWeight   :700}}>Name: </span>{student.name}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//          <span style={{fontWeight:700}}>Email: </span> {student.email}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//           <span style={{fontWeight:700}}>Class: </span>{student.student_class.class_text}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//           <span style={{fontWeight:700}}>Age: </span> {student.age}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//           <span style={{fontWeight:700}}>Gender: </span>{student.gender}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//           <span style={{fontWeight:700}}>Guardian: </span>{student.guardian}
//         </Typography>
//          <Typography gutterBottom variant="h5" component="div">
//           <span style={{fontWeight:700}}>Guardian Phone: </span>{student.guardian_phone}
//         </Typography>
//         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button onClick={()=>{
//           handleEdit(student._id)
//         }}><EditIcon /></Button>
//         <Button onClick={()=>{
//           handleDelete(student._id)
//         }} sx={{marginLeft:'10px'}}><DeleteIcon sx={{color:'red'}}/></Button>
//       </CardActions>
//     </Card> 
//                 )
//             }) }
//     </Box>
//   </Box>
// );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import axios from "axios";
import { studentSchema, studentEditSchema } from "../../../yupSchema/studentSchema";
import { baseapi } from "../../../environment";
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';

export default function Students() {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [params, setParams] = useState({});

  const fileInputRef = useRef(null);

  // Fetch classes
  const fetchClasses = () => {
    axios.get(`${baseapi}/class/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(resp => setClasses(resp.data.data))
      .catch(e => console.log("Error fetching classes:", e));
  };

  // Fetch students
  const fetchStudents = () => {
    axios.get(`${baseapi}/student/fetch-with-query`, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(resp => setStudents(resp.data.students))
      .catch(e => console.log("Error fetching students:", e.response?.data || e.message));
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [params, message]);

  // Formik
  const initialValues = {
    name: "",
    email: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    confirm_password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: edit ? studentEditSchema : studentSchema,
    onSubmit: (values) => {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("student_class", values.student_class);
      fd.append("age", values.age);
      fd.append("gender", values.gender);
      fd.append("guardian", values.guardian);
      fd.append("guardian_phone", values.guardian_phone);

      if (file) fd.append("student_image", file, file.name);
      if (values.password) fd.append("password", values.password);

      if (edit) {
        axios.patch(`${baseapi}/student/update/${editId}`, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
          .then(resp => {
            setMessage(resp.data.message);
            setMessageType('success');
            Formik.resetForm();
            handleClearFile();
            setEdit(false);
            setEditId(null);
          })
          .catch(e => {
            setMessage("Error updating student");
            setMessageType('error');
            console.log(e);
          });
      } else {
        axios.post(`${baseapi}/student/register`, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
          .then(resp => {
            setMessage(resp.data.message);
            setMessageType('success');
            Formik.resetForm();
            handleClearFile();
          })
          .catch(e => {
            setMessage("Error creating student");
            setMessageType('error');
            console.log(e);
          });
      }
    }
  });

  const addImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFile(null);
    setImageUrl(null);
  };

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);
    const student = students.find(x => x._id === id);

    Formik.setFieldValue("name", student.name);
    Formik.setFieldValue("email", student.email);
    Formik.setFieldValue("student_class", student.student_class._id);
    Formik.setFieldValue("age", student.age);
    Formik.setFieldValue("gender", student.gender);
    Formik.setFieldValue("guardian", student.guardian);
    Formik.setFieldValue("guardian_phone", student.guardian_phone);

    setImageUrl(`/images/uploaded/student/${student.student_image}`);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios.delete(`${baseapi}/student/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(resp => {
          setMessage(resp.data.message);
          setMessageType("success");
        })
        .catch(e => {
          setMessage("Error deleting student");
          setMessageType("error");
          console.log(e);
        });
    }
  };

  const handleMessageClose = () => setMessage('');

  const cancelEdit = () => {
    Formik.resetForm();
    handleClearFile();
    setEdit(false);
    setEditId(null);
  };

  const handleClassFilter = (e) => {
    setParams(prev => ({ ...prev, student_class: e.target.value || undefined }));
  };

  const handleSearch = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value || undefined }));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 4 }}>

      {message && <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose} />}

      {/* ---------- Form ---------- */}
      <Box component="form" sx={{ width: "90%", maxWidth: 500, p: 4, bgcolor: "rgba(255,255,255,0.9)", borderRadius: 3, boxShadow: 5 }} onSubmit={Formik.handleSubmit}>
        <Typography variant="h5" textAlign="center" mb={2}>{edit ? "Edit Student" : "Add Student"}</Typography>

        <Typography>Add Student Image</Typography>
        <TextField type="file" inputRef={fileInputRef} onChange={addImage} />
        {imageUrl && <CardMedia component="img" image={imageUrl} height="200" sx={{ borderRadius: 2, objectFit: "cover", mt: 1 }} />}

        <TextField name="name" label="Name" value={Formik.values.name} onChange={Formik.handleChange} margin="normal" />
        {Formik.touched.name && Formik.errors.name && <p style={{color:"red"}}>{Formik.errors.name}</p>}

        <TextField name="email" label="Email" value={Formik.values.email} onChange={Formik.handleChange} margin="normal" />
        {Formik.touched.email && Formik.errors.email && <p style={{color:"red"}}>{Formik.errors.email}</p>}

        <FormControl fullWidth margin="normal">
          <InputLabel>Student Class</InputLabel>
          <Select name="student_class" value={Formik.values.student_class} onChange={Formik.handleChange}>
            {classes.map(x => <MenuItem key={x._id} value={x._id}>{x.class_text} ({x.class_num})</MenuItem>)}
          </Select>
          {Formik.touched.student_class && Formik.errors.student_class && <p style={{color:"red"}}>{Formik.errors.student_class}</p>}
        </FormControl>

        <TextField name="age" label="Age" value={Formik.values.age} onChange={Formik.handleChange} margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={Formik.values.gender} onChange={Formik.handleChange}>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        </FormControl>

        <TextField name="guardian" label="Guardian Name" value={Formik.values.guardian} onChange={Formik.handleChange} margin="normal" />
        <TextField name="guardian_phone" label="Guardian Phone" value={Formik.values.guardian_phone} onChange={Formik.handleChange} margin="normal" />

        <TextField name="password" type="password" label="Password" value={Formik.values.password} onChange={Formik.handleChange} margin="normal" />
        <TextField name="confirm_password" type="password" label="Confirm Password" value={Formik.values.confirm_password} onChange={Formik.handleChange} margin="normal" />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button type="submit" variant="contained">Submit</Button>
          <Button type="button" variant="outlined" onClick={cancelEdit}>Cancel</Button>
        </Box>
      </Box>

      {/* ---------- Search & Filter ---------- */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        <TextField label="Search" value={params.search || ""} onChange={handleSearch} size="small" />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Student Class</InputLabel>
          <Select value={params.student_class || ""} onChange={handleClassFilter}>
            <MenuItem value="">All Classes</MenuItem>
            {classes.map(x => <MenuItem key={x._id} value={x._id}>{x.class_text} ({x.class_num})</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* ---------- Student Cards ---------- */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, width: "90%", maxWidth: 1200, mt: 3 }}>
        {students.map(student => (
          <Card key={student._id} sx={{ maxWidth: 345 }}>
            <CardMedia component="img" sx={{ height: 340 }} image={`/images/uploaded/student/${student.student_image}`} />
            <CardContent>
              <Typography><b>Name:</b> {student.name}</Typography>
              <Typography><b>Email:</b> {student.email}</Typography>
              <Typography><b>Class:</b> {student.student_class.class_text}</Typography>
              <Typography><b>Age:</b> {student.age}</Typography>
              <Typography><b>Gender:</b> {student.gender}</Typography>
              <Typography><b>Guardian:</b> {student.guardian}</Typography>
              <Typography><b>Guardian Phone:</b> {student.guardian_phone}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => handleEdit(student._id)}><EditIcon /></Button>
              <Button onClick={() => handleDelete(student._id)}><DeleteIcon sx={{ color: 'red' }} /></Button>
            </CardActions>
          </Card>
        ))}
      </Box>

    </Box>
  );
}
