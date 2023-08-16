import { useState } from "react";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Branche from "./GridComponents/Branche";
import Histogramme from "./GridComponents/Histogramme";
import PieChart from "./GridComponents/PieChart";
import Vignette from "./GridComponents/Vignette";
import Table from "./GridComponents/Table";
import { Grid, Typography } from "@material-ui/core";
import { BoardTuile } from "../../models/boardTuile";
import styles from "./dashboard.module.scss";

type GridItemProps = {
  data: BoardTuile,
  handleDelete: Function,
  isDeletable: boolean
}

export default function GridItem(props: GridItemProps) {
  const [title, setTitle] = useState<string>("");
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className={`card ${styles.vwrapper}`} style={{ height: "100%", padding: "1rem" }}>
      <div>
        <Grid
          item
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          <Grid item xs={11}>
            <Typography variant="h6" noWrap={false}>
              {title}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            xs={1}
          >
            {props.isDeletable && (
              <Grid item>
                <FontAwesomeIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    props.handleDelete(props.data.id);
                  }}
                  icon={faTimes}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
      <div className={styles.contentBody}>
        {props.data?.tool === "Top5" && props.data?.type === "branche" && (
          <Branche
            brancheId={props?.data?.branche}
            titleChange={handleTitleChange}
            horizontal={props?.data?.w === 12 && window.innerWidth > 800}
          />
        )}
        {props.data?.type === "indicateur" &&
          props.data?.format === "histogramme" && (
            <Histogramme
              tool={props?.data?.tool}
              indicator={props.data?.indicator}
              periode={props.data?.periode}
              titleChange={handleTitleChange}
            />
          )}
        {props?.data?.type === "indicateur" &&
          (props?.data?.format === "circulaire" ||
            props?.data?.format === "cercle") && (
            <PieChart
              tool={props?.data?.tool}
              indicator={props.data?.indicator}
              format={props?.data?.format}
              titleChange={handleTitleChange}
            />
          )}
        {props?.data?.type === "indicateur" &&
          props?.data?.format === "vignette" && (
            <Vignette
              tool={props?.data?.tool}
              indicator={props?.data?.indicator}
              titleChange={handleTitleChange}
              periode={props?.data?.periode}
              fiches={props?.data?.fiches}
            />
          )}
        {props?.data?.tool === "FicheSecurite" &&
          props?.data?.type === "tableau" && (
            <Table
              periode={props?.data?.periode}
              titleChange={handleTitleChange}
              propsFiches={props?.data?.fiches || []}
            />
          )}
      </div>
    </div>
  );
}
