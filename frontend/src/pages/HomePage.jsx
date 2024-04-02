import React,{useContext} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../component/Navbar";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { LinkedIn, GitHub, Instagram } from '@mui/icons-material';
import  '../styles/homePage.css'

import { useNavigate } from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom'; 
import Atmajit from "../assets/atmajit-sahoo.jpg";
import Sandipan from "../assets/sandipan-sarkar.jpg";
import W3yogesh from "../assets/w3yogesh.jpg";

import {AuthContext } from "../context/UserContext";
import {
  HomeHeroImage,
  RealtimeMsg,
  MultiMedia,
  VoiceCall,
  VideoCall,
  GroupMessage,
  MessageEncryption,
  AboutImage,
} from "../component/SVG/HomeSvg";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  hero: {
    padding: theme.spacing(5, 0),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
  intro: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  ctaButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
  ctaButtonContainer: {
    display: "flex",
    justifyContent: "start",
  },
  ctaButton: {
    width: "100%", // Make button full width
    maxWidth: "200px", // Max width to prevent stretching on larger screens
    marginRight: theme.spacing(2), // Add margin between buttons
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    maxHeight: "300px", // Adjust the max height as needed
  },
  about: {
    padding: theme.spacing(0, 0),
    background: "#eee",
    height: '100vh',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center'
  },
  feature: {
    padding: theme.spacing(6, 0),
    background: "#f0f0f0",
    textAlign: "center",
    // height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  featureCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: theme.spacing(1),
    margin: "0",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  testimonial: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  testimonialContent: {
    maxWidth: "800px",
    width: "100%",
  },
  testimonialCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: theme.spacing(3),
    margin: "0 10px 0 10px",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  team:{
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#eee",
    backgroundImage: `radial-gradient(at 47% 33%, hsl(182.19, 63%, 43%) 0, transparent 59%), 
                   radial-gradient(at 82% 65%, hsl(205.66, 92%, 35%) 0, transparent 55%)`

  },
  teamMember: {
    textAlign: 'center',
    padding: '20px 10px',
    // margin: '0 10px',
    backgroundColor: 'rgba(179, 226, 255, 0.1)',
    borderRadius: '5px',
    boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
    backdropFilter: 'blur(0px) saturate(100%)',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: '10px auto',
  },
  socialIcon: {
    marginRight: theme.spacing(1),
  },
  footer: {
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(0),
    textAlign: "center",
    width: "100%",
  },

}));

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    navigate("/chatting");
  }

  // Dummy testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Amit Patel",
      comment:
        "HiChat has revolutionized the way I communicate with my colleagues. It's seamless and efficient.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      comment:
        "I've been using HiChat for months now, and I'm impressed by its user-friendly interface and extensive features.",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      comment:
        "As a business owner, I rely on HiChat to stay connected with my clients. It's reliable and secure.",
    },
    {
      id: 4,
      name: "Neha Singh",
      comment:
        "HiChat has made remote learning fun and interactive for my students. Thank you for this amazing platform!",
    },
    {
      id: 5,
      name: "Deepak Gupta",
      comment:
        "I use HiChat daily to stay in touch with my family and friends. It's convenient and user-friendly.",
    },
    {
      id: 6,
      name: "Sneha Verma",
      comment:
        "I love how HiChat keeps me organized with its chat groups and file sharing capabilities. It's a game-changer!",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Atmajit Sahoo',
      role: 'Backend',
      image: Atmajit,
      linkedin: 'https://www.linkedin.com/in/atmajit-sahoo-9459ab190/',
      github: 'https://github.com/atmajitsahu100',
      instagram: 'https://www.instagram.com/atmajitsahoo/',
    },
    {
      id: 2,
      name: 'Sandipan Sarkar',
      role: 'Backend',
      image: Sandipan,
      linkedin: 'https://www.linkedin.com/in/sandipan-sarkar-9203a8247',
      github: 'https://github.com/Sandipan103',
      instagram: 'https://www.instagram.com/sandipansarkar40',
    },
    {
      id: 3,
      name: 'Yogesh Kumar Sai',
      role: 'Frontend and Backend',
      image: W3yogesh,
      linkedin: 'https://www.linkedin.com/in/w3yogesh',
      github: 'https://github.com/w3yogesh',
      instagram: 'https://www.instagram.com/w3yogesh',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
       <Navbar />
      <div className={classes.hero}>
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            {/* Left Side */}
            <Grid item xs={12} sm={6}>
              <div className={classes.intro}>
                <Typography
                  style={{ textAlign: "left" }}
                  variant="h4"
                  component="h1"
                  gutterBottom
                >
                  HiChat – where connections are effortless.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  style={{ margin: "30px 0", textAlign: "left" }}
                >
                  Stay in touch with loved ones, collaborate with colleagues,
                  and share unforgettable moments with friends, all within a
                  single, intuitive platform.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  style={{ margin: "0px 0 30px 0", textAlign: "left" }}
                >
                  Say goodbye to long waits for messages and hello to real-time communication. Hichat makes it easy to stay connected from anywhere, at any time.
                </Typography>
                <div className={classes.ctaButtonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.ctaButton}
                    component={Link} 
                    to="/signup"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.ctaButton}
                    component={Link} 
                    to="/login"
                  >
                    Log In
                  </Button>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <HomeHeroImage />
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={classes.about}>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          {/* Left side - Image */}
          <Grid item xs={12} sm={6}>
          <AboutImage/>
          </Grid>
          {/* Right side - About Section */}
          <Grid item xs={12} sm={6}>
            <div>
              <Typography variant="h4" component="h2" gutterBottom>
                About HiChat
              </Typography>
              <Typography variant="body1" paragraph>
                HiChat is a user-friendly chat application that allows you to stay
                connected with your loved ones.
              </Typography>
              <Typography variant="body1" paragraph>
                Whether it's chatting one-on-one or creating group conversations,
                HiChat makes communication seamless.
              </Typography>
              <Typography variant="body1" paragraph>
              Whether you're engaged in one-on-one conversations or coordinating group discussions, HiChat ensures seamless communication.
              </Typography>
              <Typography variant="body1" paragraph>
              From intimate one-on-one chats to bustling group conversations, HiChat excels in making communication effortless.
              </Typography>
              
              {/* <Button component={Link} to="/login" variant="contained" color="primary">
                Login
              </Button> */}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>



      {/* Feature Section */}
      <div className={classes.feature}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            style={{ marginBottom: "20px" }}
          >
            Key Features
          </Typography>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <RealtimeMsg />
                  <Typography variant="h5" component="h2">
                    Real-time Messaging
                  </Typography>
                  <Typography variant="body2" component="span">
                    Exchange messages instantly with friends and family,
                    ensuring seamless communication.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <MultiMedia />
                  <Typography variant="h5" component="h2">
                    Media Sharing
                  </Typography>
                  <Typography variant="body2" component="p">
                    Share photos, videos, and documents effortlessly within your
                    conversations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <VoiceCall />
                  <Typography variant="h5" component="h2">
                    Voice Calling
                  </Typography>
                  <Typography variant="body2" component="p">
                    Make crystal-clear voice calls to your contacts directly
                    from the app.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <VideoCall />
                  <Typography variant="h5" component="h2">
                    Video Calling
                  </Typography>
                  <Typography variant="body2" component="p">
                    Initiate video calls with high-definition video and audio
                    quality for face-to-face conversations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <GroupMessage />
                  <Typography variant="h5" component="h2">
                    Group Messaging
                  </Typography>
                  <Typography variant="body2" component="p">
                    Create and manage group chats to stay connected with
                    multiple contacts simultaneously.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.featureCard}>
                <CardContent>
                  <MessageEncryption />
                  <Typography variant="h5" component="h2">
                    End-to-End Encryption
                  </Typography>
                  <Typography variant="body2" component="p">
                    Ensure the security and privacy of your conversations with
                    robust end-to-end encryption.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Testimonial Section */}
      <div className={classes.testimonial}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            What Our Users Say
          </Typography>
          <Container style={{margin: '30px 0 30px 0'}}>
            <Slider {...settings}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id}>
                  <Card className={classes.testimonialCard}>
                    <CardContent>
                      <Typography variant="body1" paragraph>
                        "{testimonial.comment}"
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        - {testimonial.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Slider>
          </Container>
        </Container>
      </div>
      
      <div className={classes.team}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" style={{marginBottom:'20px'}}>
          Our Team
        </Typography>
        <Grid container justifyContent="center" spacing={3}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={3} key={member.id}>
              <div className={classes.teamMember}>
                <Avatar alt={member.name} src={member.image} className={classes.avatar} />
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {member.role}
                </Typography>
                <div>
                  <Tooltip title="LinkedIn">
                    <IconButton
                      aria-label="LinkedIn"
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener"
                      className={classes.socialIcon}
                    >
                      <LinkedIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="GitHub">
                    <IconButton
                      aria-label="GitHub"
                      href={member.github}
                      target="_blank"
                      rel="noopener"
                      className={classes.socialIcon}
                    >
                      <GitHub />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <IconButton
                      aria-label="Instagram"
                      href={member.instagram}
                      target="_blank"
                      rel="noopener"
                      className={classes.socialIcon}
                    >
                      <Instagram />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
     

      {/* Footer Section */}
      <AppBar position="relative" className={classes.footer}>
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography variant="body1">
            &copy; 2024 HiChat. All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HomePage;
