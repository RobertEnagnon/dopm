import { useRef } from "react";
import { Button, Card, CardBody, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const PUBLIC_API = process.env.REACT_APP_PUBLIC_URL;

interface SugImageProps {
  id: number;
  title: string;
  image: File | undefined;
  imageUrl: string | undefined;
  saveImage: Function;
  setImageToChange?: Function;
  handleCameraOpen: Function;
  imageNumber: number;
}

export const SugImage = ({
  id,
  title,
  image,
  imageUrl,
  saveImage,
  handleCameraOpen,
  imageNumber,
}: SugImageProps) => {
  const im = useRef<HTMLInputElement>(null);
  return (
    <Card>
      <CardBody>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {title}
        </Row>
        <Row
          style={{
            height: "125px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!image && !imageUrl && (
            <div style={{ textAlign: "center" }}>Aucune image inserée</div>
          )}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          )}
          {imageUrl && (
            <img
              src={PUBLIC_API + imageUrl}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          )}
        </Row>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "10px"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              im?.current?.click();
            }}
            for="file"
          >
            {!image ? "Ajouter" : "Modifier"}
          </Button>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={im}
            onChange={(event) => {
              saveImage(event, id);
            }}
          />
          <FontAwesomeIcon
            color="primary"
            icon={faCamera}
            size="2x"
            onClick={() => handleCameraOpen(imageNumber)}
            style={{ marginLeft: 10 }}
          />
        </div>
      </CardBody>
    </Card>
  );
};
