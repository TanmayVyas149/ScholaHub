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
import { periodSchema } from "../../../yupSchema/periodSchema";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from "formik";
import axios from "axios";
import dayjs from "dayjs";

import { baseapi } from "../../../environment";
import MessageSnackbar from "../../../basic utility components/snackbar/MessageSnackbar";
import { teacherEditSchema, teacherSchema } from "../../../yupSchema/teacherSchema";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
export default function ScheduleEvent({ selectedClass, handleEventClose, handleMessageNew, edit, selectedEventId }) {
    const periods = [
        { id: 1, label: 'Period 1 (10:00 AM - 11:00 AM)', startTime: '10:00', endTime: '11:00' },
        { id: 2, label: 'Period 2 (11:00 AM - 12:00 AM)', startTime: '11:00', endTime: '12:00' },
        { id: 3, label: 'Period 3 (12:00 AM - 1:00 PM)', startTime: '12:00', endTime: '13:00' },
        { id: 4, label: 'Lunch Break (1:00 PM - 2:00 PM)', startTime: '13:00', endTime: '14:00' },
        { id: 5, label: 'Period 4 (2:00 PM - 3:00 PM)', startTime: '14:00', endTime: '15:00' },
        { id: 6, label: 'Period 5 (3:00 PM - 4:00 PM)', startTime: '15:00', endTime: '16:00' },
    ]

    const initialValues = {
        teacher: "",
        subject: "",
        period: "",
        date: null,
    }
      const handleDelete=()=>{
        if(confirm("Are you sure you want t delete ? ")){
       axios.delete(`${baseapi}/schedule/delete/${selectedEventId}`).then(resp=>{
        handleMessageNew(resp.data.message,"success")
        //Formik.resetForm();
        handleCancel()
       }).catch((e)=>{
        console.log("Error",e);
        handleMessageNew("error in deleting schedule","error")
       })
    }
    }
    const handleCancel=()=>{
        Formik.resetForm();
        handleEventClose();
    }
    const [teachers, setTeachers] = useState([])
    const [subjects, setSubjects] = useState([])
    const Formik = useFormik({
        initialValues,
        validationSchema: periodSchema,
        //     onSubmit: (values) => {
        //         let date = values.date;
        //         let startTime = values.period.split(",")[0]
        //          let endTime = values.period.split(",")[0]
        //         console.log("Schedule", {...values,date,startTime,endTime})
        //         axios.post(`${baseapi}/schedule/create`,{...values,selectedClass,startTime:new Date(date.setHours(startTime.split(":")[0],
        //         startTime.split(':')[1]
        //         )),
        //         endTime:new Date(date.setHours(endTime.split(":")[0],
        //         endTime.split(':')[1]
        //         )),
        //     },
        // ).then(resp=>{
        //     console.log("response",resp)
        // }).catch((e)=>{
        //     console.log("error",e)
        // });
        //     }
        onSubmit: (values) => {

            if (!values.date) {
                console.log("Date missing");
                return;
            }

            // Split period -> ["10:00", "11:00"]
            const [startTimeStr, endTimeStr] = values.period.split(",");

            // Convert dayjs to JS Date
            const baseDate = values.date.toDate();

            // Create a new object (avoid mutation)
            const startTime = new Date(baseDate);
            startTime.setHours(
                startTimeStr.split(":")[0],
                startTimeStr.split(":")[1]
            );

            const endTime = new Date(baseDate);
            endTime.setHours(
                endTimeStr.split(":")[0],
                endTimeStr.split(":")[1]
            );
            let BACKEND_URL = `${baseapi}/schedule/create`
            if (edit) {
                BACKEND_URL = `${baseapi}/schedule/update/${selectedEventId}`;
            } 
            axios.post(BACKEND_URL, {
                teacher: values.teacher,
                subject: values.subject,
                selectedClass,
                startTime,
                endTime
            })
                .then((resp) => {
                    console.log("response", resp);
                    // setMessage(resp.data.message);
                    // setMessageType("success")
                    handleMessageNew(resp.data.message, "success")
                    Formik.resetForm();
                    handleEventClose();
                })
                .catch((err) => {
                    console.log("error", err);
                    //   setMessage("Error in creating Schedule .");
                    // setMessageType("error")
                    handleMessageNew("Error in creating new Schedule ", "success")
                });
        }

    });
    const fetchData = async () => {
        const teacherResponse = await axios.get(`${baseapi}/teacher/fetch-with-query`, { params: {} });
        const subjectResponse = await axios.get(`${baseapi}/subject/all`);
        setTeachers(teacherResponse.data.teachers)
        setSubjects(subjectResponse.data.data)
    }

    useEffect(() => {
        fetchData();
    }, []);
    const dateFormat = (date) => {
        const dateHours = date.getHours();
        const dateMinutes = date.getMinutes()
        return `${dateHours}:${dateMinutes < 10 ? '0' : ''}${dateMinutes}`
    }
    useEffect(() => {
        if (edit && selectedEventId) {
            axios
                .get(`${baseapi}/schedule/fetch/${selectedEventId}`)
                .then(resp => {
                    Formik.setFieldValue("teacher", resp.data.data.teacher)
                    Formik.setFieldValue("subject", resp.data.data.subject)
                    Formik.setFieldValue("period", `${start.getHours()}:${(start.getMinutes() < 10 ? '0' : '') + start.getMinutes()},${start.getHours()}:${(end.getMinutes() < 10 ? '0' : '') + end.getMinutes()}`)
                    let start = new Date(resp.data.data.startTime);
                    let end = new Date(resp.data.data.endTime);
                    const finalFormattedTime = dateFormat(start) + ',' + dateFormat(end)
                    Formik.setFieldValue("period", `${finalFormattedTime}`)
                })
                .catch(e => {
                    console.log("ERROR", e);
                });
        }
    }, [edit, selectedEventId])
    return (
        <>
            {/* {message && (
                            <MessageSnackbar
                              message={message}
                              type={messageType}
                              handleClose={handleMessageClose}
                            />
                          )} */}
            <Box component="form"
                sx={{
                    width: "90%", maxWidth: 500, p: 4, bgcolor: "rgba(255,255,255,0.9)", borderRadius: 3, boxShadow: 5
                }}
                onSubmit={Formik.handleSubmit}
            >
                {edit ? <Typography variant="h4" sx={{ textAlign: 'center' }}>Edit Period</Typography> :
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>Add new Period</Typography>
                }



                <FormControl fullWidth margin="normal">
                    <InputLabel>Teachers</InputLabel>
                    <Select
                        name="teacher"
                        value={Formik.values.teacher}
                        label="Teacher"
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                    >
                        {teachers && teachers.map(x => {
                            return (<MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>)
                        })}
                    </Select>
                    {Formik.touched.teacher && Formik.errors.teacher && <p style={{ color: "red" }}>{Formik.errors.teacher}</p>}

                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Subjects</InputLabel>
                    <Select
                        name="subject"
                        label="Subject"
                        value={Formik.values.subject}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}>
                        {subjects && subjects.map(x => {
                            return (<MenuItem key={x._id} value={x._id}>{x.subject_name}</MenuItem>)
                        })}
                    </Select>
                    {Formik.touched.subject && Formik.errors.subject && <p style={{ color: "red" }}>{Formik.errors.subject}</p>}
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Periods</InputLabel>
                    <Select
                        label='Periods'
                        name="period"
                        value={Formik.values.period}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                    >
                        {periods && periods.map(x => {
                            return (<MenuItem key={x._id} value={`${x.startTime}, ${x.endTime}`}>{x.label}</MenuItem>)
                        })}
                    </Select>
                    {Formik.touched.period && Formik.errors.period && <p style={{ color: "red" }}>{Formik.errors.period}</p>}
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            label="Date"
                            value={Formik.values.date ? dayjs(Formik.values.date) : null}
                            onChange={(value) => Formik.setFieldValue("date", value)}

                        />
                    </DemoContainer>
                </LocalizationProvider>
                <Button type="submit" variant="contained">Submit</Button>
                <Button type="button" variant="contained" sx={{background:'red'}} onClick={handleDelete}>Delete</Button>
                <Button type="button" variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Box>
        </>

    )
}