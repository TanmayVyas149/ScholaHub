import { Box, Typography, Paper } from "@mui/material";
import axios from "axios";
import { baseapi } from "../../../environment";
import { useState, useEffect } from "react";

export default function NoticeStudent() {
    const [notices, setNotices] = useState([]);

    const fetchAllNotices = async () => {
        try {
            const resp = await axios.get(`${baseapi}/notice/student`);
            const data = resp.data.data || [];

            // 🔥 Filter only student notices
            const studentNotices = data.filter(n => 
                n.audience?.toLowerCase() === "student"
            );

            setNotices(studentNotices);

        } catch (e) {
            console.log("Error fetching notices", e);
        }
    };

    useEffect(() => {
        fetchAllNotices();
    }, []);

    return (
        <>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Student Notices
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {notices.length > 0 ? (
                    notices.map((x) => (
                        <Paper
                            key={x._id}
                            elevation={3}
                            sx={{ m: 2, p: 2, width: "350px" }}
                        >
                            <Typography variant="h6">
                                <b>Title:</b> {x.title}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <b>Message:</b> {x.message}
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                <b>Audience:</b> {x.audience}
                            </Typography>
                        </Paper>
                    ))
                ) : (
                    <Typography>No notices for students</Typography>
                )}
            </Box>
        </>
    );
}
