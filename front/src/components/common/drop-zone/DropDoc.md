# Documentation pour le module `DropZone`

## Les librairies 
- Le Drag-and-drop est geré par [React Drag and Drop Files](https://www.npmjs.com/package/react-drag-drop-files)

- La compression d'images est geré par [Browser-image-compression](https://www.npmjs.com/package/browser-image-compression)

## Installation

Pour utiliser ce module il faut bien évidemment installer les 2 librairies precedente.

```shell
npm i --save react-drag-drop-files

#or

yarn add react-drag-drop-files
```

```shell
npm install --save browser-image-compression

#or

yarn add browser-image-compression
```

## Utilisation

Il sufit d'importer le composant `DropZone`

```jsx
import DropZone from "components/DropZone"

<DropZone {...options}>
    Glisser un fichier ici
</DropZone>
```

`options` represente les options que vous pouvez passer à `DropZone`

| Propriete  | Valeur possible | Valeur par défaut | Obligatoire |
| :--------------- |:---------------:| -----:| --------:|
| children  | string |  | oui |
| fileType  | string[ ] | ["JPG", "PNG"] | non |
| maxSize  | Taille `en Mb` | 4 | non |
| minSize  | Taille `en Mb` | 0.001 | non |
| onHandleFile  | function() |  | oui |
| disableCompression | boolean | false | non |
| maxSizeOutput  | Taille `en Mb` | 1 | non |
| maxWidthOrHeightOutput  | Taille en px | undefined | non |
| colorPrimary  | string | #0000ff | non |
| colorError  | string | #c10000 | non |
| colorText  | string | #a1a1a1 | non |

## Guide

| Propriete  | Commentaire |
| :--------------- |:---------------:|
| children  | Message affiché par defaut |
| fileType  | Tableau de types de fichiers |
| maxSize  | Taille maximale en Mb |
| minSize  | Taille minimale en Mb |
| onHandleFile  | Function à appeller pour recuperer le fichier, elle prend le fichier en parametre |
| disableCompression | Desactive la compression |
| maxSizeOutput  | Taille maximale de sortie |
| maxWidthOrHeightOutput  | Taille en px de sortie |
| colorPrimary  | Couleur primaire |
| colorError  | Couleur d'erreur |
| colorText  | Couleur des textes |

_**Nb:** l'une des 2 proprietes `maxSizeOutput` et `maxWidthOrHeightOutput` doit être utilisée_

## Supplémentaire

Le module est livré avec une fonction indépendante `CompressFile` 
Elle prend en paramètre un objet d'option
| Propriete  | Valeur possible | Valeur par défaut | Obligatoire |
| :--------------- |:---------------:| -----:| --------:|
| file  | File |  | oui |
| maxSizeOutput  | Taille `en Mb` | 1 | non |
| maxWidthOrHeightOutput  | Taille en px | undefined | non |
| onProgress | (progress: number) => void | | non |

- En entrée

| Propriete  | Commentaire |
| :--------------- |:---------------:|
| file  | Fichier d'entrée |
| maxSizeOutput  | Taille maximale de sortie |
| maxWidthOrHeightOutput  | Taille en px de sortie |
| onProgress | Recupere l'evolution de la compression en % |

- En sortie 

| Propriete  | Commentaire |
| :--------------- |:---------------:|
| file  | Fichier de sortie |
| originalSize  | Taille originale du fichier |
| newSise  | Taille apres compression |

