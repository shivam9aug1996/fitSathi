"use client";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const Lottie2 = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div style={{ minHeight: 300, maxHeight: 300, maxWidth: 300 }}>
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

export default Lottie2;
