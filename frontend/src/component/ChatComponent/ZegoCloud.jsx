import React from 'react'
import { useState, useRef, useEffect } from 'react';
import CallIcon from "@mui/icons-material/Call";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import VideocamIcon from '@mui/icons-material/Videocam';
import {IconButton} from '@mui/material';
import incoming from '../../assets/sounds/incoming_call.mp3'
import outgoing from '../../assets/sounds/outgoing_call.mp3'



const ZegoCloud = ({myId, calleeId,user1,user2}) => {
  const [incomingSound] = useState(new Audio(incoming));
  const [outgoingSound] = useState(new Audio(outgoing));

    const [userInfo, setUserInfo] = useState({
        userName: "",
        userId: "",
      });
      const zeroCloudInstance = useRef(null);
      
      async function init() {
        const userId = myId;
        const userName = "Calling" + user2;
        setUserInfo({
          userName,
          userId,
        });
        console.log(userName)
        const appID = 488373535;
        const serverSecret = "f3b1043cfb6175db07ba795897c22b4d";
    
        const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          null,
          userId,
          userName
        );
    
        zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
        // add plugin
        const c = zeroCloudInstance.current.addPlugins({ ZIM });
        if(c) console.log('call')
        // outgoingSound.play();

      }
    
      function handleSend(callType) {
        incomingSound.play();
        const callee = calleeId._id;
        console.log("call id", callee);
        console.log("myid",myId);

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