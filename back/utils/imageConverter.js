const webp = require('webp-converter')

/**
 * On ajoute un suffixe à la fin du fichier 
 * Pour l'indentifier de maniere unique
 * @param {String} name | Le nom du fichier à l'entree
 * @param {String | Number} suffix | suffixe à ajouter pour idenfifier de maniere unique
 * @param {Boolean} removeExtension | Oui/Non enlever l'extension ?
 * @returns {String} | Le nom sans/avec espace et sans extension
 */
exports.fileNameParser = (name, suffix ,removeExtension = true) => {
    const parseName = name.split(' ').join('-')
    const noExtension = parseName.split('.').slice(0, -1).join('.') + suffix
    const ext = parseName.split('.').slice(-1)[0]
    if(removeExtension) {
        return noExtension
    }
    return noExtension + '.' + ext
}
/**
 * 
 * @param {String} originPath | Fichier image à convertir
 * @param {String} finalPath | Fichier de sortie
 * @returns {Promise<any>}
 */
exports.imageConverter = async (originPath, finalPath) => {
    webp.grant_permission()
    return await webp.cwebp(originPath, finalPath,"-q 80",logging="-v");
}