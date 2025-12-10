import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';

export default function Gallery() {
  const [schools, setSchools] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(null);

  React.useEffect(() => {
    axios
      .get('http://localhost:5000/api/school/all')
      .then((resp) => {
        console.log('SCHOOLS:', resp.data);
        setSchools(resp.data.schools);
      })
      .catch((e) => {
        console.error('Error fetching schools:', e);
      });
  }, []);

  const handleOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedSchool(null);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 'bold',
          color: '#000000ff',
        }}
      >
        Registered Schools
      </Typography>

      {/* Image grid - exactly 2 per row */}
      <ImageList
        sx={{
          width: '100%',
          height: 'auto',
        }}
        cols={2}
        gap={20}
      >
        {schools.map((school) => (
          <ImageListItem
            key={school._id || school.school_image}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <img
              src={`./images/uploaded/school/${school.school_image}`}
              alt={school.school_name}
              loading="lazy"
              onClick={() => handleOpen(school)}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
            <ImageListItemBar
              title={school.school_name}
              position="below"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            outline: 'none',
            width: '90%',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {selectedSchool && (
            <>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#1976d2',
                }}
              >
                {selectedSchool.school_name}
              </Typography>

              <img
                src={`./images/uploaded/school/${selectedSchool.school_image}`}
                alt={selectedSchool.school_name}
                style={{
                  width: '100%',
                  maxHeight: '70vh',
                  borderRadius: '10px',
                  objectFit: 'contain',
                }}
              />
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
