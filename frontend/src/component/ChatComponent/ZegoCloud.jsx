import React from 'react'
import { useState, useRef, useEffect } from 'react';
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import VideoCall from "../../pages/Home";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const ZegoCloud = ({myId, calleeId}) => {
    const [userInfo, setUserInfo] = useState({
        userName: "",
        userId: "",
      });
      const zeroCloudInstance = useRef(null);

    async function init() {
        const userId = myId;
    
        const userName = "user_" + userId;
        setUserInfo({
          userName,
          userId,
        });
    
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
        zeroCloudInstance.current.addPlugins({ ZIM });
      }
    
      function handleSend(callType) {
        const callee = calleeId;
        console.log("call id", callee);
        console.log(myId);
        if (!callee) {
          alert("userID cannot be empty!!");
          return;
        }
    
        // send call invitation
        zeroCloudInstance.current
          .sendCallInvitation({
            callees: [{ userID: callee, userName: "user_" + callee }],
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
    <div>
         <Button
            variant="contained"
            onClick={() => {
              handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
            }}
            startIcon={<CallIcon />}
            color="primary"
          >
            Video Call
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSend(ZegoUIKitPrebuilt.InvitationTypeVoiceCall);
            }}
            startIcon={<CallIcon />}
            color="primary"
          >
            Voice Call
          </Button>
    </div>
  )
}
export default ZegoCloud;