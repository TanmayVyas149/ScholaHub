import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { useFormik } from 'formik';
import axios from 'axios';
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { registerSchema } from '../../../yupSchema/registerSchema';
import bgImage from '../../../../src/assets/background_img.jpg';
export default function Register() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const fileInputRef = React.useRef(null);

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

  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: ""
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log("Register submit value", values);

      if (file) {
        const fd = new FormData();
        fd.append("image", file, file.name);
        fd.append("school_name", values.school_name);
        fd.append("email", values.email);
        fd.append("owner_name", values.owner_name);
        fd.append("password", values.password);

        axios.post('http://localhost:5000/api/school/register', fd)
          .then(resp => {
            console.log(resp);
            setMessage(resp.data.message);
            setMessageType('success');
            Formik.resetForm();
            handleClearFile();
          })
          .catch(e => {
            setMessage(e.response?.data?.message || "Error occurred");
            setMessageType('error');
            console.log("Error", e);
          });
      } else {
        setMessage('Please Add School image');
        setMessageType('error');
      }
    }
  });

  const handleMessageClose = () => {
    setMessage('');
  }
  return (
    <Box
      sx={{
       backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {message && (
        <MessageSnackbar
          message={message}
          type={messageType}
          handleClose={handleMessageClose}
        />
      )}

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
        onSubmit={Formik.handleSubmit}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          Register Your School
        </Typography>

        {/* File Upload */}
        <Typography variant="body1">Add School Picture</Typography>
        <TextField
          type='file'
          inputRef={fileInputRef}
          onChange={addImage}
        />

        {/* Preview Uploaded Image */}
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            height="200"
            sx={{ borderRadius: 2, objectFit: "cover", mt: 1 }}
          />
        )}

        {/* School Name */}
        <TextField
          name='school_name'
          label="School Name"
          value={Formik.values.school_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.school_name && Formik.errors.school_name && (
          <p style={{ color: "red" }}>{Formik.errors.school_name}</p>
        )}

        {/* Email */}
        <TextField
          name='email'
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.email && Formik.errors.email && (
          <p style={{ color: "red" }}>{Formik.errors.email}</p>
        )}

        {/* Owner Name */}
        <TextField
          name='owner_name'
          label="Owner Name"
          value={Formik.values.owner_name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.owner_name && Formik.errors.owner_name && (
          <p style={{ color: "red" }}>{Formik.errors.owner_name}</p>
        )}

        {/* Password */}
        <TextField
          name='password'
          type='password'
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.password && Formik.errors.password && (
          <p style={{ color: "red" }}>{Formik.errors.password}</p>
        )}

        {/* Confirm Password */}
        <TextField
          name='confirm_password'
          type='password'
          label="Confirm Password"
          value={Formik.values.confirm_password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.confirm_password && Formik.errors.confirm_password && (
          <p style={{ color: "red" }}>{Formik.errors.confirm_password}</p>
        )}
        <Box sx={{display:"flex",justifyContent:"space-between",mt:2}}>
        {/* Submit Button */}
        <Button
          type='submit'
          variant='contained'
          sx={{ mt: 2, py: 1.2, fontSize: "1rem" }}
        >
          Submit
        </Button>
        <Button
          type='submit'
          variant='outlined'
          sx={{ py: 1.2, fontSize: "1rem", width: "48%" }}
          onClick={()=>{
            Formik.resetForm();
            handleClearFile();
          }}
        >
          Cancel
        </Button>
        </Box>
      </Box>
    </Box>
  );
}
