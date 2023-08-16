type DatasetType = {
  label?: string,
  type?: string,
  yAxisID?: string,
  backgroundColor?: string | Array<string>,
  borderColor?: string | Array<string>,
  hoverBackgroundColor?: string | Array<string>,
  hoverBorderColor?: string | Array<string>,
  pointRadius?: number,
  order?: number,
  data: Array<number>,
  barPercentage?: number,
  stack?: string,
  comment?: Array<string>,
  datalabels?: Object,
}

export type {
  DatasetType
}