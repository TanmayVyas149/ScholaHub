import { useEffect, useState } from "react"
import { baseapi } from "../../../environment";
import axios from "axios";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import { Typography, Box, Button, TextField, CardMedia } from "@mui/material";

export default function Dashboard(){
    const [school,setSchool] = useState(null);
    const [edit,setEdit] = useState(false);
     const [file, setFile] = React.useState(null);
      const [imageUrl, setImageUrl] = React.useState(null);
      const [schoolName,setSchoolName] = useState(null)
      const [message, setMessage] = React.useState('');
      const [messageType, setMessageType] = React.useState('success');
      const fileInputRef = React.useRef(null);
    const handleMessageClose = () => {
    setMessage('');
  }
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
    const fetchSchool = ()=>{
        axios.get(`${baseapi}/school/fetch-single`).then(resp=>{
            console.log(resp);
            setSchool(resp.data.school);
            setSchoolName(resp.data.school.school_name);
        }).catch(e=>{
            console.log("Error",e);
        });
   }
   useEffect(()=>{
        fetchSchool();
   },[message])
//    const handleEditSubmit = () =>{
//             const fd = new FormData();
//             fd.append("school_name",schoolName);
//             if (file) {
//                 fd.append("image",file,file.name);
//             } 
//             axios.patch(`${baseapi}/school/update`,fd)
//             .then(resp=>{
//                 console.log("school edit",resp);
//             }).catch(e=>{
//                 console.log("error",e);
//             })
//    }
const handleEditSubmit = () => {
  const fd = new FormData();
  fd.append("school_name", schoolName);
  if (file) {
    fd.append("image", file, file.name);
  }

  axios
    .patch(`${baseapi}/school/update`, fd)
    .then((resp) => {
      console.log("school edit", resp);
      setEdit(false);
      handleClearFile();
          setMessage(resp.data.message);
            setMessageType('success');
            cancelEdit();
            
      // ✅ Update state immediately
      fetchSchool(); // reload updated school details (with new image)
    })
    .catch((e) => {
    setMessage(e.response?.data?.message || "Error occurred");
            setMessageType('error');
            console.log("Error", e);
    });
};

   const cancelEdit = () =>{
    setEdit(false)
    handleClearFile();
   }

    return(
        <>
        <h1>Dashboard</h1>
           {message && (
                <MessageSnackbar
                  message={message}
                  type={messageType}
                  handleClose={handleMessageClose}
                />
              )}
        {/* {edit && <>
            <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '90%',
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: 5,
        }}
        
      >

        <Typography variant="body1">Add School Picture</Typography>
        <TextField
          type='file'
          inputRef={fileInputRef}
          onChange={addImage}
        />

    
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            height="200"
            sx={{ borderRadius: 2, objectFit: "cover", mt: 1 }}
          />
        )}

        {/* School Name */}
        {/* <TextField
          name='school_name'
          label="School Name"
          value={school.school_name}
          onChange={(e)=>{
                setSchoolName(e.target.value)
          }}
          
   
        />
           <Button onClick={handleEditSubmit}>Submit Edit</Button>
       <Button onClick={cancelEdit}>Cancel</Button>
        </Box> */}
        {/* </>} */} 
        {edit && (
  <Box
    component="form"
    sx={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: 500,
      mx: "auto", // centers horizontally
      mt: 8, // margin from top
      p: 4, // padding inside box
      borderRadius: 3,
      bgcolor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    }}
  >
    <Typography
      variant="h5"
      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
    >
      Edit School Details
    </Typography>

    <Typography variant="body1" sx={{ textAlign: "left", mb: 1 }}>
      Add School Picture
    </Typography>

    <TextField
      type="file"
      inputRef={fileInputRef}
      onChange={addImage}
      sx={{ mb: 2 }}
    />

    {imageUrl && (
      <CardMedia
        component="img"
        image={imageUrl}
        height="200"
        sx={{
          borderRadius: 2,
          objectFit: "cover",
          mb: 2,
        }}
      />
    )}

    <TextField
      name="school_name"
      label="School Name"
      value={schoolName || ""}
      onChange={(e) => setSchoolName(e.target.value)}
      sx={{ mb: 3 }}
    />

    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button
       
        onClick={handleEditSubmit}
        variant="contained"
        color="primary"
        sx={{ width: "48%" }}
      >
        Save
      </Button>
      <Button
        onClick={cancelEdit}
        variant="outlined"
        color="error"
        sx={{ width: "48%" }}
      >
        Cancel
      </Button>
    </Box>
  </Box>
)}


        {
            school && 
            // <Box sx={{height:'500px',width:'100%',
            //     background:`url(/images/uploaded/school/${school.school_image})`,
            //     display:'flex',
            //     justifyContent:'center',
            //     alignItems:'center'
            // }}>
            //     <Typography variant='h3'>{school.school_name}</Typography>
            // </Box>
            <Box sx={{ textAlign: 'center' }}>
    <img
      src={`/images/uploaded/school/${school.school_image}`}
      alt={school.school_name}
      style={{ width: '100%', height: '500px', objectFit: 'cover' }}
    />
    <Typography variant="h3">{school.school_name}</Typography>
            <Box component={'div'} sx={{position:'absolute',bottom:'10px', right:'10px', height:'50px', width:'50px' }}>
          <Button variant ='outlined' sx={{background:'white', color:'black',height:'60px',borderRadius:'50%'}} 
          onClick={()=>{
            setEdit(true);
          }}> <EditIcon /> </Button>
            </Box>
  </Box>
        }
        
        </>
    )
}