import React, { ReactElement } from "react";
import { Grid } from "@material-ui/core";

type LightBoxType = {
  children: ReactElement;
  src: string;
  srcDraw?: string;
  alt: string;
  zIndex?: number;
};

export const LightBox = ({
  children,
  src,
  srcDraw,
  alt,
  zIndex = 9999999999999,
}: LightBoxType) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div onClick={toggleIsOpen}>
      {children}
      {isOpen ? (
        <div
          onClick={toggleIsOpen}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.7)",
            cursor: "pointer",
            zIndex,
          }}
        >
          {srcDraw ? (
              <div style={{position: "relative"}}>
                <img
                    src={src}
                    alt={alt}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translateX(-50%) translateY(30%)"
                    }}
                />
                <img
                    src={srcDraw}
                    alt={alt}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translateX(-50%) translateY(30%)"
                    }}
                />
              </div>
          ) : (
              <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  style={{ height: "100%", width: "100%" }}
              >
                <Grid item style={{ height: "100%" }}>
                  <img
                      src={src}
                      alt={alt}
                      style={{
                        height: "100%",
                        width: "auto",
                      }}
                  />
                </Grid>
              </Grid>
          )}

        </div>
      ) : null}
    </div>
  );
};
