"use client";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const Lottie1 = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      style={{
        minHeight: 300,
        maxHeight: 300,
        maxWidth: 300,
        // justifyContent: "center",
        // backgroundColor: "cyan",
        // alignItems: "center",
        // display: "flex",
        //maxHeight: 100,
        // alignSelf: "center",
        width: "60%",
      }}
    >
      {isLoading && (
        <Spinner
          label="Loading..."
          style={{ position: "absolute", minHeight: 300, left: 0, right: 0 }}
        />
      )}
      <DotLottiePlayer
        onEvent={(event: PlayerEvents) => {
          if (event === PlayerEvents.Ready) {
            setIsLoading(false);
          }
        }}
        src="/lottie2.lottie"
        autoplay
        loop
      />
    </div>
  );
};

export default Lottie1;
