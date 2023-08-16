/**Peut etre utilisé pour d|autres champs text */

/**
 * Callback pour rendre le champ texte.
 * <CharactersCounter
 *  inputRender={(max) => {
 *      return <Controller
 *          ...utiliser le parametre 'max' ici
 *      />
 *  }}
 * />
 * @callback inputRender
 * @param {number} max - Nombre maximal de caracteres.
 */

/**
 * Compte le nombre de caracteres
 * @param {Object} props
 * @param {string} props.actualValue - le texte saisie (utiliser watch() pour le recuperer)
 * @param {inputRender} props.inputRender
 * @param {maxCharacter} props.maxCharacter - définit le nombre de caractères
 * @returns {JSX.Element}
 */
const CharactersCounter = ({actualValue, inputRender, maxCharacter}: {actualValue: string, inputRender: Function, maxCharacter?: number}) => {
    const MAX_CHARACTERS = maxCharacter || 300

    return <>
        {inputRender(MAX_CHARACTERS)}
        <div className="d-flex justify-content-end" style={{fontSize:"0.8em"}}>
            {actualValue? actualValue.length: 0}/{MAX_CHARACTERS}
        </div>
    </>
}

export default CharactersCounter
