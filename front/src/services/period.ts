import RequestService from "./request";
import { PeriodEnum, PeriodType } from '../models/period'
import moment from 'moment';
import 'moment/locale/fr'

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const ranks = ['Premier', 'Second', 'Troisième', 'Dernier']

// True si la date courante remplit le critère de périodicité
// False sinon
// (ex: creationDate: 07/10/2022, currentDate: 08/10/2022
// period: tous les 3 jours => return false)
export const hasToBeDisplayed = (creationDate: string,
    currentDate: string,
    period: PeriodType): boolean => {

    const mCreationDate = moment(creationDate).hour(0);
    const mCurrentDate  = moment(currentDate).hour(0);
    //console.log('currentDate', currentDate)
    //console.log('creationDate', creationDate)

    // if(period)
    //     console.log('period', period)

    switch(period.periodEnum){

        case PeriodEnum.quotidienne: {
            const variation = mCurrentDate.diff(mCreationDate, 'days');
            //console.log('variation ', variation)
            return (variation % period.every) == 0 ? true : false
        } 

        case PeriodEnum.hebdomadaire: {
            const {day} = period
            if(!day?.length) return false;

            const variation = moment(mCurrentDate).date(1)
            .diff(moment(mCreationDate).date(1), 'weeks');
            //console.log('variation ', variation)
            if(variation % period.every !== 0)
                return false;

            let currentDay = mCurrentDate.locale('fr').format('dddd')
            //console.log('jour ', currentDay)
            //console.log( "days", day)
            if(day.includes(currentDay)) return true;
            else return false;
        }

        case PeriodEnum.mensuelle:{
            const {rank, every, day} = period
            if(!rank) return false

            //console.log('rank ', rank)

            // On met les dates au '1' de chaque mois
            // avant de comparer l'écart de mois
            const variation = moment(mCurrentDate).date(1)
            .diff(moment(mCreationDate).date(1), 'months');
            console.log('variation ', variation)

            if(variation % every !== 0)
            return false;
            
            if(!isNaN(parseInt(rank)))
            {
                const currentDay = mCurrentDate.format('Do')
                if( currentDay === rank)
                    return true;
                else
                    return false
            }

            else if(!ranks.includes(rank)) return false

            else if(day?.length !== 1) return false

            else {
                let date = moment(currentDate).date(1)

                // Sert à calculer bShift, et bShift sert à gérer la différence de cas dans les
                // situtations suivantes: par exemple, si le 1er du mois est un mercredi, la fonction day(4) va 
                // retourner le jeudi juste après, par contre day(2) va retourner le mardi de cette semaine, donc
                // celui juste avant le mercredi (et pas celui de la semaine pro)
                let alphabeticDay = date.format('dddd')
                alphabeticDay = alphabeticDay.charAt(0).toUpperCase() + alphabeticDay.substring(1)
                const bShift = (days.indexOf(alphabeticDay) >=  days.indexOf(day[0])) ? 1 : 0;

                // On fait ça car si le premier jour du mois est un samedi par exemple
                // le premier samedi est aujourd'hui et pas dans +7 jours
                if(date.format('dddd') === day[0].toLocaleLowerCase())
                    date.day(-6)

                // Calculer à quel jour du mois ça correspond: le 8, le 22, etc ..
                const index = days.indexOf(day[0]) + 7 * (ranks.indexOf(rank) + bShift);
                date.days(index)

                //console.log("Jour du mois : ", date.format('dddd, MMMM Do YYYY'))
                return mCurrentDate.format('dddd, MMMM Do YYYY') === date.format('dddd, MMMM Do YYYY')
            }
        }

        case PeriodEnum.annuelle:{
            let variation = moment(mCurrentDate).date(1).month(0)
            .diff(moment(mCreationDate).date(1).month(0), 'years');
            console.log('variation annuelle', variation)

            const {rank, every, month, day} = period

            if(!rank) return false

            // Vérifier l'année
            if(variation % every !== 0) return false;

            // Vérifier le mois
            let currentMonth = mCurrentDate.format('MMMM')
            currentMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.substring(1)
            //console.log(currentMonth)
            if( month !== currentMonth)
                return false;

            // ex: Le 10 de chaque mois
            if(!isNaN(parseInt(rank)))
            {
                // Vérifier le jour
                let currentDay = mCurrentDate.format('Do')
                if(currentDay === '1er') currentDay = '1'
                console.log('currentDay', currentDay)
                if( currentDay !== rank)
                    return false;

                else return true;
            }

            // ex: Tous les ans, le Premier Lundi de Mars
            else
            {
                let date = moment(currentDate).date(1)

                // Sert à calculer bShift, et bShift sert à gérer la différence de cas dans les
                // situtations suivantes: par exemple, si le 1er du mois est un mercredi, la fonction day(4) va 
                // retourner le jeudi juste après, par contre day(2) va retourner le mardi de cette semaine, donc
                // celui juste avant le mercredi (et pas celui de la semaine pro)
                let alphabeticDay = date.format('dddd')
                alphabeticDay = alphabeticDay.charAt(0).toUpperCase() + alphabeticDay.substring(1)
                const bShift = (days.indexOf(alphabeticDay) >=  days.indexOf(day![0])) ? 1 : 0;

                // On fait ça car si le premier jour du mois est un samedi par exemple
                // le premier samedi est aujourd'hui et pas dans +7 jours
                if(date.format('dddd') === day![0].toLocaleLowerCase())
                    date.day(-6)

                // Calculer à quel jour du mois ça correspond: le 8, le 22, etc ..
                const index = days.indexOf(day![0]) + 7 * (ranks.indexOf(rank) + bShift);
                date.days(index)

                //console.log(date.format('dddd, MMMM Do YYYY'))
                return mCurrentDate.format('dddd, MMMM Do YYYY') === date.format('dddd, MMMM Do YYYY')
            }

        }

        default: return false;
    }
}


export const createPeriodicText = (period: PeriodType) => {

    if (!period) return 'Périodicité : tous les jours'

    //console.log(period)

    let tous = 'tous'
    let periodEnum;
    let le = 'le'
    let moisOuJour;
    switch (period.periodEnum) {
        case PeriodEnum.quotidienne:
            {
                return `Périodicité : tous les ${period.every} jours`;
            }

        case PeriodEnum.hebdomadaire:
            {
                tous = 'toutes'
                periodEnum = 'semaines'
                if (period.day && period.day.length > 0) {
                    console.log("period.day", period.day)
                    le = 'les'
                    if( Array.isArray( period.day ) ) {
                        moisOuJour = period.day.join(', ')
                    } else {
                        moisOuJour = period.day
                    }
                }
                break;
            }

        case PeriodEnum.mensuelle:
            {
                periodEnum = 'mois'
                moisOuJour = period.rank + ' '
                if (isNaN(parseInt(moisOuJour!))) {
                    moisOuJour = moisOuJour.charAt(0).toLocaleLowerCase() + moisOuJour.substring(1)
                    moisOuJour += period.day![0].charAt(0).toLocaleLowerCase() + period.day![0].substring(1)
                }
                break;
            }

        case PeriodEnum.annuelle:
            {
                periodEnum = ' ans'
                moisOuJour = period.rank + ' '
                if (isNaN(parseInt(moisOuJour!)))
                    moisOuJour += period.day![0] + ' de ' + period.month
                else moisOuJour += period.month

                break;
            }

        default:
            return ''
    }

    const periodText = `Périodicité : ${tous} les ${period.every} ${periodEnum}, ${le} ${moisOuJour}`

    return periodText;
}

const PostPeriod = async (period: PeriodType) => {
    let req = new RequestService();
    return await req.fetchEndpoint("period-create", "POST", period)
}


const periodServices = {
    PostPeriod
}

export default periodServices 