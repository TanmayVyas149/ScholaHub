import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import { baseapi } from "../../../environment";
export default function Attendee({ classId, handleMessage, message }) {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("")
    const handleSubmit = async () => {
        try {
            if (selectedTeacher) {
                const response = await axios.patch(`${baseapi}/class/update/${classId}`, { attendee: selectedTeacher })
                console.log(response, "Submit attendee")
                handleMessage("success in attendee save/update", "success")
            } else {
                alert("Please select teacher first ")
            }

        } catch (error) {
            console.log("ERROR", error)
        }
    }
    const fetchTeachers = () => {
        axios
            .get(`${baseapi}/teacher/fetch-with-query`, {

                params: {},
            })
            .then((resp) => {
                // expected payload: { success: true, message: "...", teachers: [...] }
                setTeachers(resp.data.teachers);
            })
            .catch((e) => {
                console.error("Backend Error:", e.response?.data || e.message);


            });
    };
    const [attendee, setAttendee] = useState(null)
    // const fetchClassDetails = async()=>{
    //   if(classId){

    //    try {
    //      const response = axios.get(`${baseapi}/class/single/${classId}`);
    //      setAttendee(response.data.data.attendee? (await response).data.data.attendee:null)
    //      console.log("SINGLE CLASS ",response);
    //    } catch (error) {
    //     console.log("ERROR",error)
    //    }
    //   }
    // }
    const fetchClassDetails = async () => {
        if (!classId) return;

        try {
            const response = await axios.get(`${baseapi}/class/single/${classId}`);
            console.log("Single Class:", response.data);

            const attendeeData = response.data?.data?.attendee || null;
            setAttendee(attendeeData);
        } catch (error) {
            console.log("ERROR fetching class:", error);
        }
    };

    useEffect(() => {

        console.log("CLASS ID", classId);
        fetchClassDetails();
        fetchTeachers();
    }, [classId,message])
    return (<>
        <h1>Attendee</h1>
        <Box>
            {attendee && <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: 'center' }} component={'div'}>
                <Typography variant="h5">
                    Attendee Teacher:
                </Typography>
                <Typography variant="h5" >
                    {attendee.name}
                </Typography>

            </Box>
            }

            <FormControl sx={{ width: '200px', marginLeft: '10px' }}>
                <InputLabel>Select Teachers</InputLabel>
                <Select value={selectedTeacher}
                    label="Select Teachers"
                    onChange={(e) => {
                        setSelectedTeacher(e.target.value)
                    }}>
                    <MenuItem value="">Select Teacher</MenuItem>
                    {teachers && teachers.map(x => <MenuItem key={x._id} value={x._id}>{x.name} </MenuItem>)}
                </Select>
            </FormControl>

            <Button onClick={handleSubmit}>
                {attendee ? "Change Attendee " : "Select Attendee"}
            </Button>
        </Box>
    </>)
}