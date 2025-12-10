import * as React from 'react';
import { Button, Box, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import MessageSnackbar from '../../../basic utility components/snackbar/MessageSnackbar';
import { loginSchema } from '../../../yupSchema/loginSchema';
import bgImage from '../../../../src/assets/background_img.jpg';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function Login() {
  const [role,setRole] = React.useState('student')
  const navigate = useNavigate();
  const {login} = React.useContext(AuthContext)
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');
  const handleMessageClose = () => setMessage('');

  const initialValues = { email: "", password: "" };

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
  onSubmit: (values) => {

    let URL;
    if(role==='student'){
        URL = 'http://localhost:5000/api/student/login';
    }else if(role==='teacher'){
           URL = 'http://localhost:5000/api/teacher/login';
    }else if(role==='school'){
           URL = 'http://localhost:5000/api/school/login';
    }

  axios.post(URL,{...values})
    .then(resp => {
      console.log("Login response:", resp.data);
      
      // ✅ Extract token & user correctly
      const token = resp.data.token;
      const user = resp.data.school || resp.data.user;

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // ✅ Pass both to context
      login({ token, user });

      // ✅ Redirect based on role
      if (user?.role === "SCHOOL") navigate("/school");
      else if (user?.role === "STUDENT") navigate("/student");
      else if (user?.role === "TEACHER") navigate("/teacher");

      setMessage(resp.data.message);
      setMessageType('success');
      formik.resetForm();
    })
    .catch(e => {
      setMessage(e.response?.data?.message || "Error occurred");
      setMessageType('error');
      console.error("Error", e);
    });
}

  });

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
        onSubmit={formik.handleSubmit}
      >
         <Typography variant="h5" textAlign="center" mb={2}>
          Login
        </Typography>
         <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={(e)=>(setRole(e.target.value))}
        >
          <MenuItem value={'student'}>Student</MenuItem>
          <MenuItem value={'teacher'}>Teacher</MenuItem>
          <MenuItem value={'school'}>School</MenuItem>
        </Select>
      </FormControl>
       

        <TextField
          name='email'
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          margin="normal"
        />
        {formik.touched.email && formik.errors.email && (
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        )}

        <TextField
          name='password'
          type='password'
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          margin="normal"
        />
        {formik.touched.password && formik.errors.password && (
          <p style={{ color: "red" }}>{formik.errors.password}</p>
        )}

        <Button
          type='submit'
          variant='contained'
          sx={{ mt: 2, py: 1.2, fontSize: "1rem" }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
