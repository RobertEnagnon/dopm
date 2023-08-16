const french = require('./lang/fr.json')
const english = require('./lang/en.json')
const spanish = require('./lang/sp.json')

exports.defaultLang = {
    french, english, spanish
}
/**
 * Retourne une fonction
 * Qui permet de selectionner un texte en fonction de la langue
 * l'objet d'entree est de la forme 
 * obj = {
 *  french: fichier.json,
 *  english: fichier.json,
 *  spanish: fichier.json
 * }
 * @param {*} obj 
 * @returns {(lang: string, position: string) => string}
 */
exports.traduction = (obj) => {
    const flattenObj = (ob) => {
        let result = {}

        for (const i in ob) {
            if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
                const temp = flattenObj(ob[i])
                for (const j in temp) {
                    result[i + '.' + j] = temp[j]
                }
            }else {
                result[i] = ob[i]
            }
        }
        return result
    }
    /**
     * 
     * @param {string} lang 
     * @param {string} position 
     * @returns {string}
     */
    const t = (lang = 'french', position) => {
        if(!obj[`${lang}`]){
            console.error(`La langue ${lang} n'est pas disponible dans ${obj}`)
            return ""
        }
        const ob = flattenObj(obj[`${lang}`])
        if(!ob[`${position}`]){
            console.error(`La cle ${position} n'existe pas dans l'objet de langue ${obj[`${lang}`]}`)
            return ""
        }
        return ob[`${position}`]
    }
    return t
}