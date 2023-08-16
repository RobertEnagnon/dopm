/* eslint-disable no-unused-vars */
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Category } from "../../models/Top5/category";
import { Curve } from "../../models/Top5/curve";
import {
  CalculHisto,
  Indicator,
  IndicatorMode,
} from "../../models/Top5/indicator";
import { DeleteCurvesByIndicator } from "../../services/Top5/curve";
import {
  CreateIndicator,
  DeleteIndicator,
  ArchiveIndicator,
  GetIndicatorById,
  GetIndicatorsByCategory,
  UpdateIndicator,
  formatDate,
} from "../../services/Top5/indicator";
import { DeleteTargetsByIndicator } from "../../services/Top5/target";
import {
  GetAllIndicatorsCalculHistorical,
  DeleteHistoricalsByIndicator,
  UpdateCalculHistorical,
} from "../../services/Top5/historical";
import { Target } from "../../models/Top5/target";
import { notify, NotifyActions } from "../../utils/dopm.utils";

interface indicatorProps {
  category?: Category;
  indicatorId?: number;
  isArchived?: boolean;
}

export interface UseIndicatorReturnProps {
  indicator: Indicator | undefined;
  indicators: Indicator[];
  calculHistorical: CalculHisto[];
  setIndicators: Dispatch<SetStateAction<Indicator[]>>;
  selectedIndicator: Indicator | undefined;
  setSelectedIndicator: Dispatch<SetStateAction<Indicator | undefined>>;
  FetchIndicatorById: (indicatorId: number) => Promise<Indicator | undefined>;
  OnAddIndicator: (indicatorToAdd: Indicator) => Promise<void>;
  OnUpdateIndicator: (indicatorToUpdate: Indicator) => Promise<void>;
  OnDeleteIndicator: (indicatorToDelete: Indicator) => Promise<void>;
  OnArchiveIndicator: (indicatorToArchive: Indicator) => Promise<void>;
  UpdateHistorical: (
    indicatorId: number,
    selectedDate: string
  ) => Promise<void>;
  changeIndicatorOrder: (
    indicator: Indicator,
    isAscend: boolean
  ) => Promise<void>;
}

export const useIndicator = ({
  category,
  indicatorId,
  isArchived,
}: indicatorProps): UseIndicatorReturnProps => {
  const [indicators, setIndicators] = useState<Array<Indicator>>([]);
  const [calculHistorical, setCalculHistorical] = useState<Array<CalculHisto>>(
    []
  );
  const [indicator, setIndicator] = useState<Indicator>();
  const [selectedIndicator, setSelectedIndicator] = useState<
    Indicator | undefined
  >(undefined);

  useEffect(() => {
    GetCalculHistorical();
  }, []);

  useEffect(() => {
    category && fetchIndicatorsByCategory();
  }, [category, isArchived]);

  useEffect(() => {
    indicatorId && FetchIndicatorById(indicatorId!);
  }, [indicatorId]);

  const fetchIndicatorsByCategory = async () => {
    GetIndicatorsByCategory(category!.id, false, isArchived).then(
      async (res) => {
        if (res) {
          let indicatorsToDisplay: Array<Indicator> = [];
          res.map(async (item) => {
            const curves: Array<Curve> = item.curves || [];
            const targets: Array<Target> = item.targets || [];

            indicatorsToDisplay.push({
              ...item,
              curves: curves,
              targets: targets,
            });
          });

          setIndicators(
            indicatorsToDisplay.sort(
              (indicator1, indicator2) =>
                indicator1.orderIndicator! - indicator2.orderIndicator!
            )
          );
        }
      }
    );
  };

  const FetchIndicatorById = async (indicatorId: number) => {
    const indicator = await GetIndicatorById(indicatorId);
    setIndicator(indicator);
    return indicator;
  };

  const OnAddIndicator = async (indicatorToAdd: Indicator) => {
    const { indicator, indicatorFile }: any = await CreateIndicator({
      ...indicatorToAdd,
      categoryId: category?.id,
    });

    console.log("indicatorToAdd", indicatorToAdd);

    if (
      (indicator && indicator.indicatorMode === IndicatorMode.Daily) ||
      (indicator && indicator.indicatorMode === IndicatorMode.Weekly) ||
      (indicator && indicator.indicatorMode === IndicatorMode.Monthly) ||
      (indicator &&
        indicator.indicatorMode === IndicatorMode.PDF &&
        indicatorFile) ||
      (indicator &&
        indicator.indicatorMode === IndicatorMode.File &&
        indicator.fileName) ||
      (indicator && indicator.indicatorMode === IndicatorMode.Module)
    ) {
      let newIndicator: Indicator = indicator;
      newIndicator.updatedAt = formatDate(indicator.updatedAt);

      setIndicators((prevIndicators) => [...prevIndicators, newIndicator]);
      notify(
        `L'indicateur ${newIndicator.name} a été ajouté`,
        NotifyActions.Successful
      );
    }

    if (
      indicator &&
      indicator.indicatorMode === IndicatorMode.PDF &&
      !indicatorFile
    ) {
      notify("Echec de l'ajout du fichier.", NotifyActions.Error);
    }

    if (
      indicator &&
      indicator.indicatorMode === IndicatorMode.File &&
      !indicator.fileName
    ) {
      notify("Echec de l'ajout du fichier.", NotifyActions.Error);
    }

    if (!indicator) {
      notify("Echec de l'ajout de l'indicateur.", NotifyActions.Error);
    }
  };

  const OnUpdateIndicator = async (indicatorToUpdate: Indicator) => {
    const res: any = await UpdateIndicator({
      ...indicatorToUpdate,
      categoryId: category?.id,
    });

    if (res) {
      setIndicators((prevIndicators) => {
        const index = prevIndicators.findIndex(
          ({ id }) => id === indicatorToUpdate.id
        );
        indicatorToUpdate.updatedAt = formatDate();
        indicatorToUpdate.updatedAt = formatDate();
        prevIndicators[index] = indicatorToUpdate;
        return prevIndicators;
      });

      notify(
        `L'indicateur ${indicatorToUpdate.name} a été modifié`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la modification de l'indicateur.", NotifyActions.Error);
    }
    console.log(res);
  };

  const OnDeleteIndicator = async (indicatorToDelete: Indicator) => {
    await DeleteTargetsByIndicator(indicatorToDelete?.id);
    await DeleteCurvesByIndicator(indicatorToDelete?.id);
    await DeleteHistoricalsByIndicator(indicatorToDelete?.id);

    const res = await DeleteIndicator(indicatorToDelete);
    if (res) {
      setIndicators((prevIndicators) =>
        prevIndicators.filter(
          (indicator) => indicator.id !== indicatorToDelete.id
        )
      );

      notify(
        `L'indicateur ${indicatorToDelete.name} a été supprimé`,
        NotifyActions.Successful
      );
    } else {
      notify("Echec de la suppression de l'indicateur.", NotifyActions.Error);
    }
  };

  const OnArchiveIndicator = async (indicatorToArchive: Indicator) => {
    const res = await ArchiveIndicator(indicatorToArchive);
    const isArchived = indicatorToArchive.isArchived;
    if (res) {
      setIndicators((prevIndicators) =>
        prevIndicators.filter(
          (indicator) => indicator.id !== indicatorToArchive.id
        )
      );

      notify(
        `L'indicateur ${indicatorToArchive.name} a été ${
          isArchived ? "déarchivé" : "archivé"
        }`,
        NotifyActions.Successful
      );
    } else {
      notify(
        `Echec ${
          isArchived ? "du désarchivage" : "de l'archivage"
        } de l'indicateur.`,
        NotifyActions.Error
      );
    }
  };

  const changeIndicatorOrder = async (
    indicator: Indicator,
    isAscend: boolean
  ) => {
    const nextIndex =
      indicators.findIndex((item) => item.id === indicator.id) + 1;
    const prevIndex =
      indicators.findIndex((item) => item.id === indicator.id) - 1;

    const nextIndicator = isAscend ? indicators[nextIndex] : indicator;
    const prevIndicator = !isAscend ? indicators[prevIndex] : indicator;

    const newNextIndicator = {
      ...nextIndicator!,
      orderIndicator: prevIndicator?.orderIndicator,
    };
    const newPrevIndicator = {
      ...prevIndicator!,
      orderIndicator: nextIndicator?.orderIndicator,
    };

    setIndicators((prevIndicators: Indicator[]) =>
      [
        ...prevIndicators.filter(
          (item) =>
            item.id !== prevIndicator?.id && item.id !== nextIndicator?.id
        ),
        newNextIndicator,
        newPrevIndicator,
      ].sort(
        (indicator1, indicator2) =>
          indicator1.orderIndicator! - indicator2.orderIndicator!
      )
    );

    await OnUpdateIndicator(newNextIndicator);
    await OnUpdateIndicator(newPrevIndicator);
  };

  const GetCalculHistorical = async () => {
    const calculHistorical = await GetAllIndicatorsCalculHistorical();
    setCalculHistorical(calculHistorical);
  };

  const UpdateHistorical = async (
    indicatorId: number,
    selectedDate: string
  ) => {
    await UpdateCalculHistorical(indicatorId, selectedDate);
  };

  return {
    indicator,
    indicators,
    calculHistorical,
    setIndicators,
    selectedIndicator,
    setSelectedIndicator,
    FetchIndicatorById,
    OnAddIndicator,
    OnUpdateIndicator,
    OnDeleteIndicator,
    changeIndicatorOrder,
    UpdateHistorical,
    OnArchiveIndicator,
  };
};
