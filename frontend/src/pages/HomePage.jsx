import React, { useContext, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Grid, Card, CardContent, AppBar, Toolbar, Avatar, IconButton, Tooltip } from "@mui/material";
import { LinkedIn, GitHub, Instagram } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

import Navbar from "../component/Navbar";
import { AuthContext } from "../context/UserContext";
import {
  HomeHeroImage, RealtimeMsg, MultiMedia, VoiceCall,
  VideoCall, GroupMessage, MessageEncryption, AboutImage,
} from "../component/SVG/HomeSvg";

import Atmajit from "../assets/atmajit-sahoo.jpg";
import Sandipan from "../assets/sandipan-sarkar.jpg";
import W3yogesh from "../assets/w3yogesh.jpg";

// Styled Components using MUI's styled API
const HeroSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 0),
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
  },
}));

const CtaButtonContainer = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "start",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const FeatureSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(6, 0),
  background: "#f0f0f0",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const TestimonialSection = styled('div')(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
}));

const TeamSection = styled('div')({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "#eee",
  backgroundImage: `radial-gradient(at 47% 33%, hsl(182.19, 63%, 43%) 0, transparent 59%), 
                   radial-gradient(at 82% 65%, hsl(205.66, 92%, 35%) 0, transparent 55%)`,
});

const TeamMember = styled('div')({
  textAlign: "center",
  padding: "20px 10px",
  backgroundColor: "rgba(179, 226, 255, 0.1)",
  borderRadius: "5px",
  boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
  backdropFilter: "blur(0px) saturate(100%)",
});

const FooterSection = styled(AppBar)(({ theme }) => ({
  top: "auto",
  bottom: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  textAlign: "center",
  width: "100%",
}));

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chatting");
    }
  }, [isAuthenticated, navigate]);

  const testimonials = [
    { id: 1, name: "Amit Patel", comment: "HiChat has revolutionized communication." },
    { id: 2, name: "Priya Sharma", comment: "Impressive user-friendly interface!" },
    { id: 3, name: "Rajesh Kumar", comment: "It's reliable and secure." },
    { id: 4, name: "Neha Singh", comment: "Made remote learning fun." },
    { id: 5, name: "Deepak Gupta", comment: "Convenient and user-friendly." },
    { id: 6, name: "Sneha Verma", comment: "It's a game-changer!" },
  ];

  const teamMembers = [
    {
      id: 1, name: "Atmajit Sahoo", role: "Backend",
      image: Atmajit, linkedin: "https://www.linkedin.com/in/atmajit-sahoo-9459ab190/",
      github: "https://github.com/atmajitsahu100", instagram: "https://www.instagram.com/atmajitsahoo/",
    },
    {
      id: 2, name: "Sandipan Sarkar", role: "Backend",
      image: Sandipan, linkedin: "https://www.linkedin.com/in/sandipan-sarkar-9203a8247",
      github: "https://github.com/Sandipan103", instagram: "https://www.instagram.com/sandipansarkar40",
    },
    {
      id: 3, name: "Yogesh Kumar Sai", role: "Frontend and Backend",
      image: W3yogesh, linkedin: "https://www.linkedin.com/in/w3yogesh",
      github: "https://github.com/w3yogesh", instagram: "https://www.instagram.com/w3yogesh",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      <Navbar />
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" component="h1" gutterBottom textAlign="left">
                HiChat – where connections are effortless.
              </Typography>
              <Typography variant="body1" paragraph sx={{ margin: "30px 0", textAlign: "left" }}>
                Stay in touch with loved ones, collaborate with colleagues, and share unforgettable moments with friends.
              </Typography>
              <Typography variant="body1" paragraph sx={{ textAlign: "left" }}>
                Say goodbye to long waits for messages and hello to real-time communication.
              </Typography>
              <CtaButtonContainer>
                <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ maxWidth: "200px", width: "100%" }}>
                  Sign Up
                </Button>
                <Button variant="outlined" color="primary" component={Link} to="/login" sx={{ maxWidth: "200px", width: "100%", marginLeft: 2 }}>
                  Log In
                </Button>
              </CtaButtonContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              <HomeHeroImage />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <FeatureSection>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={5}>
            {[RealtimeMsg, MultiMedia, VoiceCall, VideoCall, GroupMessage, MessageEncryption].map((Icon, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Icon />
                    <Typography variant="h5" component="h2">
                      {["Real-time Messaging", "Media Sharing", "Voice Calling", "Video Calling", "Group Messaging", "End-to-End Encryption"][index]}
                    </Typography>
                    <Typography variant="body2">
                      {["Exchange messages instantly", "Share photos, videos, and docs", "Make crystal-clear voice calls", "High-quality video calls",
                        "Manage group chats", "Ensure secure communication"][index]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeatureSection>

      <TestimonialSection>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            What Our Users Say
          </Typography>
          <Container sx={{ margin: "30px 0" }}>
            <Slider {...sliderSettings}>
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} sx={{ padding: 3, margin: "0 10px" }}>
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      "{testimonial.comment}"
                    </Typography>
                    <Typography variant="h6" component="h3">
                      - {testimonial.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Slider>
          </Container>
        </Container>
      </TestimonialSection>

      <TeamSection>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Meet the Team
          </Typography>
          <Grid container spacing={5}>
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <TeamMember>
                  <Avatar src={member.image} alt={member.name} sx={{ width: 100, height: 100, margin: "0 auto" }} />
                  <Typography variant="h5" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {member.role}
                  </Typography>
                  <Grid container justifyContent="center">
                    {[member.linkedin, member.github, member.instagram].map((link, index) => (
                      <Grid item key={index}>
                        <Tooltip title={["LinkedIn", "GitHub", "Instagram"][index]} arrow>
                          <IconButton component="a" href={link} target="_blank">
                            {[<LinkedIn />, <GitHub />, <Instagram />][index]}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </TeamMember>
              </Grid>
            ))}
          </Grid>
        </Container>
      </TeamSection>

      <FooterSection position="static">
        <Toolbar>
          <Typography variant="body1">
            © {new Date().getFullYear()} HiChat. All Rights Reserved.
          </Typography>
        </Toolbar>
      </FooterSection>
    </div>
  );
};

export default HomePage;
