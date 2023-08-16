import { toast } from 'react-toastify';
import { MUIDataTableOptions } from "mui-datatables";
import { camelCase } from 'lodash-es';

// eslint-disable-next-line no-unused-vars
export enum NotifyActions {
    // eslint-disable-next-line no-unused-vars
    Successful = 'success',
    // eslint-disable-next-line no-unused-vars
    Error = 'error'
}

// Default color for forms
export const defaultColor = {
    value: "#28A745",
    name: "Vert"
}

// eslint-disable-next-line no-unused-vars
export enum Color {
    // eslint-disable-next-line no-unused-vars
    red = "#DC3545",
    // eslint-disable-next-line no-unused-vars
    green = "#28A745",
    // eslint-disable-next-line no-unused-vars
    white = "#FFF",
    // eslint-disable-next-line no-unused-vars
    blue = "#3B7DDD",
    // eslint-disable-next-line no-unused-vars
    black = "#000",
}

// List of colors used in application
export const Colors = [
    { value: "#28A745", name: "Vert" },
    { value: "#3B7DDD", name: "Bleu" },
    { value: "#6F42C1", name: "Violet" },
    { value: "#E83E8C", name: "Rose" },
    { value: "#DC3545", name: "Rouge" },
    { value: "#FD7E14", name: "Orange" },
    { value: "#FFC107", name: "Jaune" },
    { value: "#20C997", name: "Sarcelle" },
    { value: "#17A2B8", name: "Cyan" },
    { value: "#6C757D", name: "Gris" },
    { value: "#343A40", name: "Noir" },
];

const notify = (message: string, action: NotifyActions) => {
    if (action === NotifyActions.Successful) {
        toast.success(message, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else if (action === NotifyActions.Error) {
        toast.error(message, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}

const options: MUIDataTableOptions = {
    filterType: 'dropdown',
    rowsPerPageOptions: [1, 10, 20, 50, 100],
    rowsPerPage: 20,
    selectableRowsHideCheckboxes: true
};

const pascalCase = (obj: any): Array<any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(pascalCase);
  }

  const result: any = {};
  Object.entries(obj).forEach(([k, v]) => {
    result[camelCase(k)] = pascalCase(v);
  });
  return result;
};

export {
    notify,
    options,
    pascalCase
}
