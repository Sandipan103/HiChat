import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { server, AuthContext } from "../../context/UserContext";
import toast from "react-hot-toast";

import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UpdateProfile = ({ userData, setOpen }) => {
  //   const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState(null);
  const [isImageUploadOpen, setImageUploadOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [profileUrl, setProfileUrl] = useState();
  const navigate = useNavigate();


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setName(userData.firstName);
    setAbout(userData.about);
    const profileImageUrl =
      userData.profile && `${server}/fetchprofile/${userData.profile}`;
    setProfileUrl(profileImageUrl);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const token = Cookies.get("tokenf");
    if (!token) {
      navigate("/login");
    }
    if (token) {
      try {
        const data = new FormData();
        data.append("userId", userData._id);
        data.append("firstName", name);
        data.append("about", about);
        data.append("profile", profile);
        console.log(data.get("userId"));
        setLoading(true);
        const response = await axios.put(
          `${server}/updateUserProfileById`,
          data
        );
        toast.success("profile updated");
        window.location.reload();
      } catch (error) {
        toast.error("profile not updated");
        console.error("Error updating profile:", error);
      } finally {
        setLoading(false);
       
      }
    }
  };

  const handleProfileChange = async (e) => {
    setProfile(e.target.files[0]);
    const file = e.target.files[0];
    const reader = new FileReader();
    if (profile) {
      const data = new FormData();
      data.append("profile", profile);
      data.append("userId", userData._id);
      setProfileUrl(profile);
      console.log(profileUrl);
    }
    reader.onloadend = () => {
      setProfile(file);
      setProfileUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <React.Fragment>
        <Dialog
          fullScreen={fullScreen}
          open={true}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          sx={{ m: 0, p: 2 }}
          maxWidth="xs"
          fullWidth="true"
        >
          <DialogContent>
            <Box
              alignItems="center"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                role="button"
                className="userImage"
                src={profileUrl}
                sx={{
                  width: "150px",
                  height: "150px",
                  cursor: "pointer",
                }}
              ></Avatar>
              <Button
                component="label"
                role={undefined}
                variant="text"
                color="secondary"
                tabIndex={-1}
                sx={{
                  color: "#000000b5",
                  background: "#aab6ca",
                  textTransform: "node",
                }}
              >
                <CloudUploadIcon />
                <span style={{ display: "inline-grid", alignItems: "center" }}>
                  Change Profile
                </span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  name="image"
                  onChange={handleProfileChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </Button>
              <br />
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="About"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="contactNo"
                value={userData.contactNo}
                disabled
                fullWidth
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="outlined">
              Close
            </Button>
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};
