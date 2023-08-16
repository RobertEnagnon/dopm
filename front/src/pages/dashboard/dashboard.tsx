import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Row, Container, Col } from "reactstrap";
import SettingsIcon from "@material-ui/icons/Settings";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { parseNumber } from "@telerik/kendo-intl";
import GridItem from "./GridItem";
import Layout from "../layout";
import { Branch } from "../../models/Top5/branch";
import { Category } from "../../models/Top5/category";
import { Indicator } from "../../models/Top5/indicator";
import { User } from "../../models/user";
import { BoardTuile } from "../../models/boardTuile";
import Tool from "./addDashboard/tool";
import Type from "./addDashboard/type";
import Branches from "./addDashboard/branches";
import Categories from "./addDashboard/categories";
import Indicators from "./addDashboard/indicators";
import Periods from "./addDashboard/periods";
import Formats from "./addDashboard/formats";
import Sizes from "./addDashboard/sizes";
import Preview from "./addDashboard/preview";
import { DeleteBoardById, UpdateBoardsLayout } from "../../services/board";
import styles from "./dashboard.module.scss";
import { useBoard } from "../../hooks/board";
import { useTranslation } from "react-i18next";
// import { Language } from "../../services/enums/Language";
import "../../components/top5/chart";
import { permissionsList } from "../../models/Right/permission";
import { useUser } from "../../components/context/user.context";
import { useParams } from "react-router-dom";
import { Theme } from "@mui/material";
import { useDopm } from "../../components/context/dopm.context";

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -280,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

export default function Dashboard() {
  const dopm = useDopm();

  // States
  const [open, setOpen] = useState<boolean>(false);
  const [branches, setBranches] = useState<Array<Branch>>([]);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [indicators, setIndicators] = useState<Array<Indicator>>([]);
  const { FetchAllBoards } = useBoard();
  const params = useParams();
  const [idNextDroppedElement, setIdNextDroppedElement] = useState<number>(0);
  const [layout, setLayout] = useState<Array<BoardTuile>>([]);
  const [width, setWidth] = useState<number>();
  const [user, setUser] = useState<User>();
  const { t, i18n } = useTranslation();
  // const [lang] = useState<Language>(i18n.language as Language);
  const cardRef = useRef<HTMLDivElement>(null);
  const userContext = useUser();
  const currentPermissions = {
    lectureDashboard: userContext.checkAccess(
      permissionsList.lectureDashboard,
      undefined,
      undefined,
      parseInt(params.dashboardId || "0")
    ),
    parametrageDashboard: userContext.checkAccess(
      permissionsList.parametrageDashboard,
      undefined,
      undefined,
      parseInt(params.dashboardId || "0")
    ),
  };

  const classes = useStyles();

  // const ln = user?.language;

  // Form handler
  const { setValue, resetField, control, trigger, watch } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });
  const formValue = watch();

  const generateNextElementId = () => {
    const id = idNextDroppedElement;
    setIdNextDroppedElement(idNextDroppedElement + 1);
    return id;
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const onDrop = async (l: GridLayout.Layout[], layoutItem: BoardTuile) => {
    let gridItem = {
      ...layoutItem,
      i: generateNextElementId() + "",
      ...formValue,
      indicator_id: parseInt(formValue.indicator, 10),
      w: parseNumber(formValue.size) || 3,
      minW: parseNumber(formValue.size) || 3,
      maxW: parseNumber(formValue.size) || 3,
    };

    const dbValues = await UpdateBoardsLayout(
      [...layout, gridItem],
      parseInt(params.dashboardId || "0")
    );
    const result: Array<BoardTuile> = dbValues.map((value) => {
      return cleanBoardValues(value);
    });
    setLayout(result);
  };

  const handleDropDragOver = () => {
    let h, minH;

    console.log("formValue", formValue);

    if (formValue.tool === "Top5" && formValue.type === "branche") {
      if (formValue.size === "12") {
        h = 4;
      }
      if (formValue.size === "3") {
        h = 9;
      }
    }
    if (["circulaire", "cercle", "vignette"].includes(formValue.format)) {
      h = 8;
    }
    if (formValue.format === "histogramme") {
      h = 11;
    }
    if (formValue.type === "tableau") {
      h = 14;
      minH = 14;
    }

    return {
      w: parseNumber(formValue.size || 3),
      h: h || 5,
      minH: minH || (h || 5) - 1,
      maxH: (h || 5) + 5,
    };
  };
  const cleanBoardValues = (board: BoardTuile) => {
    for (const key in board) {
      if (
        board[key as keyof BoardTuile] === null ||
        board[key as keyof BoardTuile] === undefined
      ) {
        delete board[key as keyof BoardTuile];
      }
    }
    return board;
  };
  const handleDelete = async (id: number) => {
    await DeleteBoardById(id);
    const newLayout = layout.filter((item) => {
      return item.id !== id;
    });
    setLayout(newLayout);
  };

  const getDifference = (
    layout1: Array<BoardTuile>,
    layout2: Array<BoardTuile>
  ) => {
    return layout1.filter((item) => {
      return !layout2.some((newItem) => {
        return (
          item.i === newItem.i &&
          item.x === newItem.x &&
          item.y === newItem.y &&
          item.w === newItem.w &&
          item.h === newItem.h
        );
      });
    });
  };

  const handleLayoutChange = async (newLayoutData: Array<BoardTuile>) => {
    if (
      newLayoutData?.length > 0 &&
      [
        ...getDifference(layout, newLayoutData),
        ...getDifference(newLayoutData, layout),
      ].length > 0
    ) {
      const newLayout = newLayoutData.map((item) => {
        const newData = layout?.find((v) => {
          return v.i === item.i;
        });
        return { ...newData, ...item };
      });

      const newFiltredLayout = newLayout.filter((v) => {
        return v.i !== "__dropping-elem__";
      });

      const dbValues = await UpdateBoardsLayout(
        newFiltredLayout,
        parseInt(params.dashboardId || "0")
      );
      let result: Array<BoardTuile> = dbValues.map((value) => {
        return cleanBoardValues(value);
      });

      // Enlever les tuiles d'indicateur archivé
      result = result.filter((board) => {
        return !board.indicator.isArchived;
      });
      setLayout(result);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const u = JSON.parse(localStorage.getItem("user") || "{}");
    const currentLang = localStorage.getItem("lang") || "{}";
    i18n.changeLanguage(currentLang);
    setUser(u);

    if (isMounted && currentPermissions?.lectureDashboard)
      FetchAllBoards(open, parseInt(params.dashboardId || "0")).then(
        ({ boards, maximum }) => {
          // Enlever les tuiles d'indicateur archivé
          boards = boards.filter((board) => {
            return !board.indicator.isArchived;
          });
          if (isMounted) {
            setIdNextDroppedElement(maximum + 1);
            setLayout(boards);
          }
        }
      );

    return () => {
      // 👇️ when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, [params, currentPermissions?.lectureDashboard]);

  useLayoutEffect(() => {
    function updateSize() {
      const elementDimensions = cardRef?.current?.getBoundingClientRect();
      setWidth(elementDimensions?.width);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      const elementDimensions = cardRef?.current?.getBoundingClientRect();
      setWidth(elementDimensions?.width);
    }, 5);
    setTimeout(() => {
      clearInterval(timer);
    }, 350);

    const l = layout.map((v) => {
      return {
        ...v,
        indicator: { ...v.indicator },
        fiches: [...(v.fiches || [])],
        isResizable: open,
      };
    });
    setLayout(l);

    return () => {
      // when component unmounts, clear interval
      clearInterval(timer);
    };
  }, [open]);

  const pageContent = layout?.map((item) => {
    return (
      <div
        key={item.i}
        data-grid={{
          ...item,
          indicator: { ...item.indicator },
          fiches: [...(item.fiches || [])],
          isResizable: false,
        }}
        style={{ height: "100%", width: "100%" }}
      >
        <GridItem data={item} handleDelete={handleDelete} isDeletable={open} />
      </div>
    );
  });

  return (
    <Layout>
      <Container fluid>
        <Row
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
          style={{ paddingRight: window.innerWidth > 800 ? "20em" : " 21em" }}
        >
          <Col md={{ size: 12, offset: 0 }}>
            <div
              className="d-flex flex-row gap-2 align-items-center"
              style={{ justifyContent: "space-between", padding: "0.5em" }}   
            >
              <div className="mr-3">
                <Typography className={styles.welcome}>
                  {t("dashboard.welcome")}{" "}
                  {`${user?.firstname} ${user?.lastname}`} !
                </Typography>
              </div>
              {!dopm.isMobileDevice &&
              currentPermissions?.parametrageDashboard ? (
                <SettingsIcon
                  className={styles.textWhite}
                  onClick={handleDrawerToggle}
                  style={{ cursor: "pointer" }}
                  
                />
              ) : (
                ""
              )}
            </div>

            <div ref={cardRef} style={{ width: "100%" }}>
              {currentPermissions?.lectureDashboard ? (
                window.innerWidth > 800 ? (
                  <GridLayout
                    className="layout"
                    cols={12}
                    rowHeight={30}
                    width={width}
                    isDroppable
                    style={{ minHeight: "800px" }}
                    onDrop={onDrop}
                    onLayoutChange={handleLayoutChange}
                    onDropDragOver={handleDropDragOver}
                    layout={layout}
                  >
                    {pageContent}
                  </GridLayout>
                ) : (
                  <div>{pageContent}</div>
                )
              ) : (
                <p className="alert-panel">Permission insuffisante</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      <Drawer
        className={styles.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        classes={{
          paper: styles.drawerPaper,
        }}
      >
        <div className={styles.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon className={styles.textWhite} />
          </IconButton>
          <Typography variant="subtitle1" className={styles.textWhite}>
            {t("dashboard.sidebarsettings")}
          </Typography>
        </div>
        <Divider />
        <form className={styles.formContainer}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Tool control={control} trigger={trigger} resetField={resetField}watch={watch}
              setValue={setValue} />
            {formValue.tool && (
              <Type
                control={control}
                trigger={trigger}
                resetField={resetField}
                formValue={formValue}
                setBranches={setBranches}setValue={setValue}
              />
            )}

            {formValue.tool === "Top5" &&
              formValue.type !== "" &&
              formValue.type !== undefined && (
                <Branches
                  branches={branches}
                  setCategories={setCategories}
                  control={control}
                  trigger={trigger}
                  resetField={resetField}
                  formValue={formValue}
                />
              )}
            {formValue.type === "indicateur" && formValue.branche && (
              <Categories
                categories={categories}
                setIndicators={setIndicators}
                control={control}
                trigger={trigger}
                resetField={resetField}
              />
            )}
            {formValue.type === "indicateur" &&
              formValue.branche &&
              formValue.category && (
                <Indicators indicators={indicators} control={control} />
              )}

            {((formValue.branche &&
              formValue.category &&
              formValue.indicator &&
              formValue.type === "indicateur") ||
              (formValue.tool === "FicheSecurite" &&
                formValue.type === "indicateur") ||
              formValue.type === "tableau") && (
              <Periods
                control={control}
                formValue={formValue}
                trigger={trigger}
                resetField={resetField}
                setValue={setValue}
              />
            )}
            {formValue.type === "indicateur" && formValue.periode && (
              <Formats
                control={control}
                formValue={formValue}
                resetField={resetField}
                setValue={setValue}
              />
            )}

            {((formValue.branche && formValue.type === "branche") ||
              (formValue.type === "tableau" && formValue.periode) ||
              (formValue.type === "indicateur" &&
                formValue.format === "histogramme")) && (
              <Sizes control={control} formValue={formValue}
            setValue={setValue}
            />
            )}
              <Grid item>
                {formValue.tool === "Top5" &&
                  formValue.type === "branche" &&
                  formValue.branche &&
                  parseInt(formValue.size) == 3 && (
                    <Preview type="branche-vert" />
                  )}
                {formValue.tool === "Top5" &&
                  formValue.type === "branche" &&
                  formValue.branche &&
                  parseInt(formValue.size) === 12 && (
                    <Preview type="branche-horiz" />
                  )}

                {formValue.type === "indicateur" &&
                  formValue.size &&
                  formValue.format === "histogramme" && (
                    <Preview type="histogramme" />
                  )}
                {formValue.type === "indicateur" &&
                  formValue.size &&
                  formValue.periode === "mensuel" &&
                  formValue.format === "circulaire" && <Preview type="pie" />}
                {formValue.type === "indicateur" &&
                  formValue.size &&
                  formValue.periode === "mensuel" &&
                  formValue.format === "cercle" && <Preview type="donut" />}
                {formValue.type === "indicateur" &&
                  formValue.size &&
                  formValue.periode &&
                  formValue.format === "vignette" &&
                    <Preview type="vignette" />}

                {formValue.type === "tableau" &&
                  formValue.periode &&
                  formValue.size && <Preview type="tableau" />}
              </Grid>
          </Grid>
        </form>
      </Drawer>
    </Layout>
  );
}
