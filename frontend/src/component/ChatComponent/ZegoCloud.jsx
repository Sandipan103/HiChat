import React from 'react'
import { useState, useRef, useEffect } from 'react';
import CallIcon from "@mui/icons-material/Call";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import VideocamIcon from '@mui/icons-material/Videocam';
import {IconButton} from '@mui/material';

const ZegoCloud = ({myId, calleeId,user1,user2}) => {
    const [userInfo, setUserInfo] = useState({
        userName: "",
        userId: "",
      });
      const zeroCloudInstance = useRef(null);

    async function init() {
        const userId = myId;
    
        const userName = "Calling" + user1;
        setUserInfo({
          userName,
          userId,
        });
    
        const appID = 549678481;
        const serverSecret = "8f597bb421444306b525fcb441c2908d";
    
        const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          null,
          userId,
          userName
        );
    
        zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
        // add plugin
        zeroCloudInstance.current.addPlugins({ ZIM });
      }
    
      function handleSend(callType) {
        const callee = calleeId._id;

        // console.log("call id", callee);
        // console.log("myid",myId);

        if (!callee) {
          alert("userID cannot be empty!!");
          return;
        }
    
        // send call invitation
        zeroCloudInstance.current
          .sendCallInvitation({
            callees: [{ userID: callee, userName: "Calling " + user1 }],
            callType: callType,
            timeout: 60,
          })
          .then((res) => {
            console.warn(res);
            if (res.errorInvitees.length) {
              alert("The user dose not exist or is offline.");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    
      useEffect(() => {
        if (myId) {
          init();
        }
      }, [myId]);
    

  return (
    <>
    <IconButton onClick={() => {
      handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
    }}>
    <VideocamIcon />
  </IconButton>

  <IconButton onClick={() => {
              handleSend(ZegoUIKitPrebuilt.InvitationTypeVoiceCall);
            }}>
    <CallIcon />
  </IconButton>
          
  
    </>
  )
}
export default ZegoCloud;