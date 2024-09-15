import React, { useContext, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
  Tooltip,
} from "@mui/material";

import { Facebook, LinkedIn, GitHub, Instagram, Twitter } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

import Navbar from "../component/Navbar";
import { AuthContext } from "../context/UserContext";
import {
  HomeHeroImage,
  RealtimeMsg,
  MultiMedia,
  VoiceCall,
  VideoCall,
  GroupMessage,
  MessageEncryption,
} from "../component/SVG/HomeSvg";

import Atmajit from "../assets/atmajit-sahoo.jpg";
import Sandipan from "../assets/sandipan-sarkar.jpg";
import W3yogesh from "../assets/w3yogesh.jpg";

// Styled Components
const HeroSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(10, 0),
  textAlign: "left",
  backgroundColor: "#F9FAFB",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
  },
}));

const CtaButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const FeatureSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: "#F0F4F8",
  textAlign: "center",
}));

const TestimonialSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#F9FAFB",
  textAlign: "center",
}));

const TeamSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#EBF0F5",
  backgroundImage: `radial-gradient(at 47% 33%, #1E90FF 0%, transparent 59%), 
                   radial-gradient(at 82% 65%, #00CED1 0%, transparent 55%)`,
}));

const TeamMember = styled("div")({
  textAlign: "center",
  padding: "20px 10px",
  backgroundColor: "rgba(179, 226, 255, 0.1)",
  borderRadius: "10px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const FooterSection = styled(AppBar)(({ theme }) => ({
  top: "auto",
  bottom: 0,
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
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
    {
      id: 1,
      name: "Amit Patel",
      comment: "HiChat has revolutionized communication.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      comment: "Impressive user-friendly interface!",
    },
    { id: 3, name: "Rajesh Kumar", comment: "It's reliable and secure." },
    { id: 4, name: "Neha Singh", comment: "Made remote learning fun." },
    { id: 5, name: "Deepak Gupta", comment: "Convenient and user-friendly." },
    { id: 6, name: "Sneha Verma", comment: "It's a game-changer!" },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Atmajit Sahoo",
      role: "Backend Developer",
      image: Atmajit,
      linkedin: "https://www.linkedin.com/in/atmajit-sahoo-9459ab190/",
      github: "https://github.com/atmajitsahu100",
      instagram: "https://www.instagram.com/atmajitsahoo/",
    },
    {
      id: 2,
      name: "Sandipan Sarkar",
      role: "Backend Developer",
      image: Sandipan,
      linkedin: "https://www.linkedin.com/in/sandipan-sarkar-9203a8247",
      github: "https://github.com/Sandipan103",
      instagram: "https://www.instagram.com/sandipansarkar40",
    },
    {
      id: 3,
      name: "Yogesh Kumar Sai",
      role: "Frontend & Backend Developer",
      image: W3yogesh,
      linkedin: "https://www.linkedin.com/in/w3yogesh",
      github: "https://github.com/w3yogesh",
      instagram: "https://www.instagram.com/w3yogesh",
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

  const TeamSection = styled('div')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(10, 0),
    backgroundColor: "#f5f7fa",
    backgroundImage: `linear-gradient(to right, #1e3c72, #2a5298)`,
    color: "#fff",
    textAlign: "center",
  }));
  
  const TeamMember = styled('div')({
    textAlign: "center",
    padding: "30px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 15px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "rgba(0, 0, 0, 0.3) 0px 12px 20px",
    },
    margin: "auto", // Center each team member's card on mobile views
  });
  
  const AvatarStyled = styled(Avatar)(({ theme }) => ({
    width: 130,
    height: 130,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  }));
  
  const IconButtonStyled = styled(IconButton)(({ theme }) => ({
    color: "#fff",
    '&:hover': {
      color: theme.palette.secondary.main,
    }
  }));

  const FooterSection = styled(AppBar)(({ theme }) => ({
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: theme.spacing(3, 0),
    textAlign: "center",
    borderTop: `1px solid ${theme.palette.divider}`,
  }));
  
  const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: "none",
    margin: theme.spacing(0, 1),
    '&:hover': {
      textDecoration: 'underline',
    },
  }));

  return (
    <div>
      <Navbar />
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                HiChat – Connecting Effortlessly.
              </Typography>
              <Typography variant="body1" paragraph>
                Stay in touch with loved ones, collaborate with colleagues, and
                share moments with friends seamlessly.
              </Typography>
              <Typography variant="body1" paragraph>
                Fast, reliable, and secure communication, all in one place.
              </Typography>
              <CtaButtonContainer>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/signup"
                  sx={{ maxWidth: "200px" }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  sx={{ maxWidth: "200px" }}
                >
                  Log In
                </Button>
              </CtaButtonContainer>
            </Grid>
            <Grid item xs={12} md={6}>
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
            {[
              RealtimeMsg,
              MultiMedia,
              VoiceCall,
              VideoCall,
              GroupMessage,
              MessageEncryption,
            ].map((Icon, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ boxShadow: 3, padding: 2 }}>
                  <CardContent>
                    <Icon />
                    <Typography variant="h5" component="h2">
                      {
                        [
                          "Real-time Messaging",
                          "Media Sharing",
                          "Voice Calling",
                          "Video Calling",
                          "Group Messaging",
                          "End-to-End Encryption",
                        ][index]
                      }
                    </Typography>
                    <Typography variant="body2">
                      {
                        [
                          "Instant messaging",
                          "Share media easily",
                          "High-quality voice calls",
                          "Video calls in HD",
                          "Manage group chats",
                          "Secure encryption",
                        ][index]
                      }
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
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                sx={{ padding: 3, margin: "0 10px", boxShadow: 2 }}
              >
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    "{testimonial.comment}"
                  </Typography>
                  <Typography variant="h6" component="h3">
                    {testimonial.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Slider>
        </Container>
      </TestimonialSection>

      <TeamSection>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h2" gutterBottom>
            Meet the Team
          </Typography>
          <Grid container spacing={6} justifyContent="center">
            {teamMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
                <TeamMember>
                  <AvatarStyled src={member.image} alt={member.name} />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {member.role}
                  </Typography>
                  <div>
                    <IconButtonStyled href={member.linkedin} target="_blank">
                      <LinkedIn />
                    </IconButtonStyled>
                    <IconButtonStyled href={member.github} target="_blank">
                      <GitHub />
                    </IconButtonStyled>
                    <IconButtonStyled href={member.instagram} target="_blank">
                      <Instagram />
                    </IconButtonStyled>
                  </div>
                </TeamMember>
              </Grid>
            ))}
          </Grid>
        </Container>
      </TeamSection>

      <FooterSection position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" color="inherit" sx={{ mb: 2 }}>
            &copy; {new Date().getFullYear()} HiChat. All Rights Reserved.
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Grid item>
              <FooterLink to="/">Home</FooterLink>
            </Grid>
            <Grid item>
              <FooterLink to="/">About Us</FooterLink>
            </Grid>
            <Grid item>
              <FooterLink to="/">Contact</FooterLink>
            </Grid>
            <Grid item>
              <FooterLink to="/">Privacy Policy</FooterLink>
            </Grid>
            <Grid item>
              <FooterLink to="/">Terms of Service</FooterLink>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <IconButton component="a" href="#" target="_blank" aria-label="Facebook">
                <Facebook />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton component="a" href="#" target="_blank" aria-label="Twitter">
                <Twitter />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton component="a" href="#" target="_blank" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton component="a" href="#" target="_blank" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </FooterSection>
    </div>
  );
};

export default HomePage;
