import { Col, Input, InputGroup, InputGroupText, Row } from "reactstrap";
import { Controller } from "react-hook-form";
import "./indicator.scss";

interface PDFRowProps {
  control: any;
  setValue: any;
  saveFile: Function;
}

export const PDFRow = ({ control, setValue, saveFile }: PDFRowProps) => {
  return (
    <Row style={{ marginTop: 20 }}>
      <Col md={5}>
        <InputGroup>
          <InputGroupText htmlFor="name">Lien :</InputGroupText>
          <Input
            type="file"
            id="file"
            onChange={(e) => saveFile(e)}
            placeholder="Choisir un fichier"
          />
        </InputGroup>
      </Col>
      <Col md={6} style={{ marginLeft: 10 }}>
        <Row>Type d'affichage</Row>
        <Controller
          name="fileType"
          control={control}
          render={({ field }) => (
            <>
              <Input
                type="radio"
                id="fileType0"
                {...field}
                checked={field.value === 0}
                onChange={() => setValue("fileType", 0)}
              />{" "}
              Classique
              <br />
              <Input
                type="radio"
                id="fileType1"
                {...field}
                checked={field.value === 1}
                onChange={() => setValue("fileType", 1)}
              />{" "}
              Full Screen
              <br />
              <Input
                type="radio"
                id="fileType2"
                {...field}
                checked={field.value === 2}
                onChange={() => setValue("fileType", 2)}
              />{" "}
              Nouvel Onglet
              <br />
            </>
          )}
        />
      </Col>
    </Row>
  );
};
