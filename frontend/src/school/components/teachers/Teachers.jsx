
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  CardMedia,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { baseapi } from "../../../environment";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { teacherEditSchema, teacherSchema } from "../../../yupSchema/teacherSchema";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Teachers() {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // preview url (object or existing)
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const fileInputRef = useRef(null);
    const [params, setParams] = useState({});
  const token = localStorage.getItem("token");

  const initialValues = {
    name: "",
    email: "",
    age: "",
    gender: "",
    qualification: "",
    password: "",
    confirm_password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: edit ? teacherEditSchema : teacherSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (edit) {
        // Update teacher
        if (!editId) {
          setMessage("No teacher selected to update");
          setMessageType("error");
          return;
        }
        const fd = new FormData();
        if (values.name) fd.append("name", values.name);
        if (values.email) fd.append("email", values.email);
        if (values.age) fd.append("age", values.age);
        if (values.gender) fd.append("gender", values.gender);
        if (values.qualification) fd.append("qualification", values.qualification);
        if (values.password) fd.append("password", values.password);
        if (file) fd.append("teacher_image", file, file.name);

        axios
          .patch(`${baseapi}/teacher/update/${editId}`, fd, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((resp) => {
            setMessage(resp.data.message || "Teacher updated");
            setMessageType("success");
            Formik.resetForm();
            setEdit(false);
            setEditId(null);
            handleClearFile();
            fetchTeachers();
          })
          .catch((e) => {
            console.error("Update error", e.response?.data || e.message);
            setMessage(e.response?.data?.message || "Error updating teacher");
            setMessageType("error");
          });
      } else {
        // Create teacher - require an image (as in your earlier UI)
        const fd = new FormData();
        fd.append("name", values.name);
        fd.append("email", values.email);
        fd.append("age", values.age);
        fd.append("gender", values.gender);
        fd.append("qualification", values.qualification);
        fd.append("password", values.password);
        if (file) {
          fd.append("teacher_image", file, file.name);
        } else {
          setMessage("Please add teacher image");
          setMessageType("error");
          return;
        }

        axios
          .post(`${baseapi}/teacher/register`, fd, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((resp) => {
            setMessage(resp.data.message || "Teacher created");
            setMessageType("success");
            Formik.resetForm();
            handleClearFile();
            fetchTeachers();
          })
          .catch((e) => {
            console.error("Create error", e.response?.data || e.message);
            setMessage(e.response?.data?.message || "Error creating teacher");
            setMessageType("error");
          });
      }
    },
  });

  const addImage = (event) => {
    const f = event.target.files[0];
    if (f) {
      setImageUrl(URL.createObjectURL(f));
      setFile(f);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
    setImageUrl(null);
  };

  const handleEdit = (id) => {
    const t = teachers.find((x) => x._id === id);
    if (!t) return;
    setEdit(true);
    setEditId(id);

    // populate formik values
    Formik.setValues({
      name: t.name || "",
      email: t.email || "",
      age: t.age || "",
      gender: t.gender || "",
      qualification: t.qualification || "",
      password: "",
      confirm_password: "",
    });

    // show existing image from backend
    if (t.teacher_image) {
      setImageUrl(`/images/uploaded/teacher/${t.teacher_image}`);
    } else {
      setImageUrl(null);
    }

    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    axios
      .delete(`${baseapi}/teacher/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((resp) => {
        setMessage(resp.data.message || "Teacher deleted");
        setMessageType("success");
        fetchTeachers();
      })
      .catch((e) => {
        console.error("Delete error", e.response?.data || e.message);
        setMessage(e.response?.data?.message || "Error deleting teacher");
        setMessageType("error");
      });
  };

  const fetchTeachers = () => {
    axios
      .get(`${baseapi}/teacher/fetch-with-query`, {
        headers: { Authorization: `Bearer ${token}` },
           params: params,
      })
      .then((resp) => {
        // expected payload: { success: true, message: "...", teachers: [...] }
        setTeachers(resp.data.teachers || []);
      })
      .catch((e) => {
        console.error("Backend Error:", e.response?.data || e.message);
        setMessage("Backend Error: " + (e.response?.data?.message || "Network Error"));
        setMessageType("error");
      });
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message,params]);

  const handleMessageClose = () => setMessage("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "12px",
        py: 4,
      }}
    >
      {message && (
        <MessageSnackbar message={message} type={messageType} handleClose={handleMessageClose} />
      )}

      {/* ---------- Register / Edit Teacher Box ---------- */}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          maxWidth: 520,
          p: 4,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.95)",
          boxShadow: 5,
        }}
        onSubmit={Formik.handleSubmit}
      >
        <Typography variant="h5" textAlign="center" mb={2}>
          {edit ? "Edit Teacher" : "Add new Teacher"}
        </Typography>

        <Typography variant="body1">Add Teacher Image</Typography>
        <TextField type="file" inputRef={fileInputRef} onChange={addImage} />

        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            height="200"
            sx={{ borderRadius: 2, objectFit: "cover", mt: 1 }}
          />
        )}

        <TextField
          name="name"
          label="Name"
          value={Formik.values.name}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.name && Formik.errors.name && <p style={{ color: "red" }}>{Formik.errors.name}</p>}

        <TextField
          name="email"
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.email && Formik.errors.email && <p style={{ color: "red" }}>{Formik.errors.email}</p>}

        <TextField
          name="age"
          label="Age"
          value={Formik.values.age}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.age && Formik.errors.age && <p style={{ color: "red" }}>{Formik.errors.age}</p>}

        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select value={Formik.values.gender} label="Gender" name="gender" onChange={Formik.handleChange}>
            <MenuItem value={"male"}>Male</MenuItem>
            <MenuItem value={"female"}>Female</MenuItem>
            <MenuItem value={"others"}>Others</MenuItem>
          </Select>
        </FormControl>
        {Formik.touched.gender && Formik.errors.gender && <p style={{ color: "red" }}>{Formik.errors.gender}</p>}

        <TextField
          name="qualification"
          label="Qualification"
          value={Formik.values.qualification}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.qualification && Formik.errors.qualification && (
          <p style={{ color: "red" }}>{Formik.errors.qualification}</p>
        )}

        <TextField
          name="password"
          type="password"
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.password && Formik.errors.password && <p style={{ color: "red" }}>{Formik.errors.password}</p>}

        <TextField
          name="confirm_password"
          type="password"
          label="Confirm Password"
          value={Formik.values.confirm_password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          margin="normal"
        />
        {Formik.touched.confirm_password && Formik.errors.confirm_password && (
          <p style={{ color: "red" }}>{Formik.errors.confirm_password}</p>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button type="submit" variant="contained" sx={{ py: 1.2, fontSize: "1rem" }}>
            {edit ? "Update" : "Submit"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              Formik.resetForm();
              handleClearFile();
              setEdit(false);
              setEditId(null);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* ---------- Search box (simple) ---------- */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", mt: 2 }}>
        <TextField
          label="Search"
          value={params.search || ""}
          variant="outlined"
          size="small"
          onChange={(e) => setParams({...params, search: e.target.value})}
        />
      </Box>

      {/* ---------- Cards ---------- */}
      <Box
        component={"div"}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "flex-start",
          width: "90%",
          maxWidth: "1200px",
          mt: 3,
        }}
      >
        {teachers.map((t) => (
          <Card key={t._id} sx={{ maxWidth: 345 }}>
            <CardMedia sx={{ height: 340 }} image={`/images/uploaded/teacher/${t.teacher_image}`} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <span style={{ fontWeight: 700 }}>Name: </span>
                {t.name}
              </Typography>

              <Typography gutterBottom variant="h6" component="div">
                <span style={{ fontWeight: 700 }}>Email: </span>
                {t.email}
              </Typography>

              <Typography gutterBottom variant="body1" component="div">
                <span style={{ fontWeight: 700 }}>Age: </span>
                {t.age}
              </Typography>

              <Typography gutterBottom variant="body1" component="div">
                <span style={{ fontWeight: 700 }}>Gender: </span>
                {t.gender}
              </Typography>

              <Typography gutterBottom variant="body1" component="div">
                <span style={{ fontWeight: 700 }}>Qualification: </span>
                {t.qualification}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                onClick={() => {
                  handleEdit(t._id);
                }}
              >
                <EditIcon />
              </Button>

              <Button
                onClick={() => {
                  handleDelete(t._id);
                }}
                sx={{ marginLeft: "10px" }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
