import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={90}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

export const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b1020",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "sans-serif",
        fontSize: 96,
        fontWeight: 700,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      Remotion works!
    </AbsoluteFill>
  );
};
