import moment from 'moment';
import 'moment/locale/fr'

export type Version = {
    id: number,
    name: string,
    date: string,
    features: string[]
}

export const formatDate = (date: string): string => {
    if(!moment(date).isValid()) return date;
    else {
        const tabDate = moment(date).locale('fr').format('Do MMMM YYYY').split(' ');
        return tabDate[0] + ' ' + tabDate[1].charAt(0).toUpperCase() + tabDate[1].slice(1) + ' ' + tabDate[2];
    }
}