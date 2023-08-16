import React, { ReactElement } from "react";
import { Grid } from "@material-ui/core";

type LightBoxType = {
  children: ReactElement,
  src: string,
  alt: string,
  zIndex?: number
}

const LightBox = ({
  children,
  src,
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
        </div>
      ) : null}
    </div>
  );
};

export default LightBox;
