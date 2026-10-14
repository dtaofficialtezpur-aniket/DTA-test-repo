import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FPS, IMS_DURATION, IMSVideo } from "./ims/IMSVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IMSVideo"
        component={IMSVideo}
        durationInFrames={IMS_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <MyComposition />
    </>
  );
};
