import React, { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import Modal from "@material-ui/core/Modal";

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

export const FileShareMenu = ({
  popOpen,
  handleCloseModal,
  setSelectedFile,
  setPopOpen,
  setSelectedType
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event) => {
    setAnchorEl(null);
    setSelectedFile(event.target.files[0]);
    setSelectedType(event.target.name)
    setPopOpen(true);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>+</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              bottom: -10,
              left: 10,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: -20, vertical: "bottom" }}
        anchorOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <Divider />
        <MenuItem
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          Document
          <input
            type="file"
            accept="*"
            style={{ display: "none" }}
            name="document"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>
        <MenuItem
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          <ListItemIcon>
            <PermMediaIcon fontSize="small" />
          </ListItemIcon>
          Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            name="image"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>

        <MenuItem
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          <ListItemIcon>
            <VideoLibraryIcon fontSize="small" />
          </ListItemIcon>
          Video
          <input
            type="file"
            accept="video/mp4,video/3gpp,video/quicktime"
            style={{ display: "none" }}
            name="video"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>
        <MenuItem
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          <ListItemIcon>
            <VideoLibraryIcon fontSize="small" />
          </ListItemIcon>
          Audio
          <input
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            name="audio"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
