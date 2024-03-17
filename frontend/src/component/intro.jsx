import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Me from '../assets/sh2.png';

const Box = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 65vw;
    height: 55vh;
    display: flex;
    z-index: 1;
    overflow: hidden;
    border: 2px solid white; /* Added white border */
`;

const BackgroundImage = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${Me});
    background-size: cover;
    background-position: center;
`;

const SubBox = styled.div`
    width: 50%;
    position: relative;
    display: flex;

    .pic {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 100%;
        height: auto;
    }
`;

const Text = styled.div`
    font-size: calc(1em + 1.5vw);
    color: white;
    padding: 2rem;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Changed to flex-start */

    & > *:last-child {
        color:grey;
        font-size: calc(0.3rem +.5vw);
        font-weight: 300;
        margin-top: .5rem; /* Added margin-top */
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
        align-self: flex-start; /* Align button to the start */
    }

    button:hover {
        background-color: #0056b3;
    }
`;

const Intro = () => {
    return (
        <Box
            initial={{ height: 0 }}
            animate={{ height: '55vh' }}
            transition={{ type: 'spring', duration: 3, delay: .8 }}
        >
            <SubBox>
                <Text>
                    <h1>CryptGuard</h1>
                    <h6>An encrypted platform for Sherlock Holmes and Dr. Watson, offering secure messaging, video calls, and group chats, safeguarding their investigations with confidentiality and versatility</h6>
                    <button>Learn More</button>
                </Text>
            </SubBox>
            <SubBox>
                <BackgroundImage />
            </SubBox>
        </Box>
    );
};

export default Intro;
