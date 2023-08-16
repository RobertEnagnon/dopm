export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const actualYear = new Date().getFullYear();
const monthsMap = () => ([
  { name: "Janv.", year: actualYear, number: "01" },
  { name: "Fev.", year: actualYear, number: "02" },
  { name: "Mars", year: actualYear, number: "03" },
  { name: "Avril", year: actualYear, number: "04" },
  { name: "Mai", year: actualYear, number: "05" },
  { name: "Juin", year: actualYear, number: "06" },
  { name: "Juil.", year: actualYear, number: "07" },
  { name: "Aout", year: actualYear, number: "08" },
  { name: "Sept.", year: actualYear, number: "09" },
  { name: "Oct.", year: actualYear, number: "10" },
  { name: "Nov.", year: actualYear, number: "11" },
  { name: "Déc.", year: actualYear, number: "12" },
]);

export const getDays = (date: Date) => {
  let month = date.getMonth() + 1;
  let lastDay =
    new Date(date.getFullYear(), date.getMonth() + 1, -1).getDate() + 1;

  let days = [];

  for (let i = 1; i < lastDay + 1; i++) {
    days.push(`${("0" + i).slice(-2)}/${("0" + month).slice(-2)}`);
  }

  return days;
};

export const getMonthesLabels = () => {
  const currentMonth = new Date().getMonth() - 1;
  const monthsArray = monthsMap();
  let months: Array<number> = [];
  for (let i = 1; i < 13; i++) {
    months = [...months, ((i + currentMonth) % 12) + 1];
  }
  return months.map((v/*, i*/) => {
    const m = monthsArray.find((month) => {
      return parseInt(month.number) === v;
    });
    return m?.name || 'Undefined';
  });
};

export const floatingMonths = () => {
  const year = new Date().getFullYear();
  const monthes = monthsMap();
  const currentMonth = new Date().getMonth();
  let firstPart = monthes.slice(currentMonth, months.length);
  let secondPart = monthes.slice(0, currentMonth);

  for (let i = 0; i < firstPart.length; i++) {
    firstPart[i].year = year - 1;
  }

  return [...firstPart, ...secondPart];
};

