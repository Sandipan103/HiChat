import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { ZIM } from 'zego-zim-web';

const RoomPage = () => {
  const { roomId } = useParams();
  const containerRef = useRef(null);

  useEffect(() => {
    const initializeMeeting = async () => {
      const appId = 488373535;
      const serverSecret = 'f3b1043cfb6175db07ba795897c22b4d';
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        Date.now().toString(),
        'atmajit'
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Join room
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: 'copy link',
            url: `http://localhost:3000/room/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });

      // Add ZIM plugin after creating ZegoUIKitPrebuilt instance
      zp.addPlugins({ ZIM });
    };

    initializeMeeting();
  }, [roomId]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default RoomPage;
