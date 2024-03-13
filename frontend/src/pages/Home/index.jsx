import React, { useEffect, useState, useRef } from "react";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export default function VideoCall() {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
  });
  const [calleeId, setCalleeId] = useState("");
  const zeroCloudInstance = useRef(null);

  async function init() {
    const userId = randomID(5);
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
    init();
  }, []);

  return (
    <div>
      <div>My username: <span>{userInfo.userName}</span></div>
      <div>My userId: <span>{userInfo.userId}</span>
      </div>
      <input
        type="text"
        is="userId"
        placeholder="callee's userID"
        onChange={(event) => {
          setCalleeId(event.target.value);
        }}
      />
      <button
        onClick={() => {
          handleSend(ZegoUIKitPrebuilt.InvitationTypeVideoCall);
        }}
      >
        Video call
      </button>
      <button
        onClick={() => {
          handleSend(ZegoUIKitPrebuilt.InvitationTypeVoiceCall);
        }}
      >
        Voice call
      </button>
    </div>
  );
}