import "./drop-zone.scss"
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import imageCompression from 'browser-image-compression';

interface DropType {
    children: string, 
    fileType?: string[], 
    maxSize?: number, 
    minSize?: number,
    onHandleFile: Function,
    disableCompression?: boolean,
    maxSizeOutput?: number,
    maxWidthOrHeightOutput?: number | undefined,
    colorPrimary?: string,
    colorError?: string,
    colorText?: string
}

export default function DropZone({
        children, 
        fileType = ["JPG", "PNG"], 
        maxSize = 4, 
        minSize = 0.001,
        onHandleFile,
        disableCompression = false,
        maxSizeOutput = 1,
        maxWidthOrHeightOutput = undefined,
        colorPrimary = "#00f",
        colorError = "#c10000",
        colorText = "#a1a1a1"

}: DropType){
    /**
     * Style
     */
    const style1 = {
        border: `2px dashed ${colorPrimary}`
    }
    const style2 = {
        border: `2px dashed ${colorError}`
    }
    const fileSize = [minSize, maxSize]
    const SVG = <svg xmlns="http://www.w3.org/2000/svg" width="31.998" height="23"><path fill={colorPrimary} d="M25.913 8.143c-.438-4.563-4.237-8.143-8.914-8.143-3.619 0-6.718 2.148-8.146 5.23-.43-.137-.878-.23-1.353-.23-2.485 0-4.5 2.016-4.5 4.5 0 .494.099.961.246 1.404-1.933 1.127-3.246 3.196-3.246 5.594 0 3.59 2.91 6.5 6.5 6.5v.002h17.999v-.002c4.144 0 7.499-3.357 7.499-7.5 0-3.656-2.62-6.693-6.085-7.355zm-6.134 5.757h-1.78v4.012c0 .553-.446 1.002-1 1.002h-2c-.552 0-1-.449-1-1.002v-4.012h-1.781c-1.086 0-1.529-.725-.987-1.609l3.781-3.727c.741-.74 1.21-.765 1.974 0l3.781 3.727c.544.885.098 1.609-.988 1.609z"/></svg>

    const initialChild = <div className="drag-drop-child" style={style1}>
        <div className="drop-svg">
            {SVG}
        </div>
        <p>{children}<span className="drop-ital">[{[...fileType].map((el: string) => {return el+", "})}{`${maxSize} Mb max`}]</span></p>
    </div>
    const [child, setChild ] = useState<JSX.Element>(initialChild)

    function onError(err: string){
        let newChild: JSX.Element = <></>
        if(err === "size"){
            newChild = <div className="drag-drop-child drag-error" style={style2}>
                <div className="drop-svg">
                    {SVG}
                </div>
                <p>Erreur: Taille maximale = {fileSize[1]} Mb</p>
            </div>
        }else if(err === "compress"){
            newChild = <div className="drag-drop-child drag-error" style={style2}>
                <div className="drop-svg">
                    {SVG}
                </div>
                <p>Erreur de compression</p>
            </div>
        }else{
            newChild = <div className="drag-drop-child drag-error" style={style2}>
                <div className="drop-svg">
                    {SVG}
                </div>
                <p>Erreur: Le fichier doit être {[...fileType]}</p>
            </div>
        }
        setChild(newChild)
        const timer = setTimeout(() => {
            setChild(initialChild)
            clearTimeout(timer)
        }, 3000)
    }
    const handleChange = (file: File) => {
        handleImageUpload(file)
    }
    const handleProcess = (process: number) => {
        if(!(process === 100 || process === 0)){
            const newChild = <div className="drag-drop-child" style={style1}>
                <div className="drop-svg">
                    {SVG}
                </div>
                <p>Compression: {process}%</p>
            </div>
            setChild(newChild)
        }else{
            setChild(initialChild)
        }
    }
    async function handleImageUpload(file: File) {

        const imageFile = file
      
        const options = {
          maxSizeMB: maxSizeOutput,
          maxWidthOrHeight: maxWidthOrHeightOutput,
          useWebWorker: true,
          onProgress: handleProcess
        }
        if (file.type.includes('jpeg') || file.type.includes('png') || file.type.includes('jpg')) {
            try {
                const compressedFileBlob = disableCompression? imageFile: await imageCompression(imageFile, options)
                const compressedFile = new File([compressedFileBlob], imageFile.name)
                onHandleFile(compressedFile)
                const successChild = <div className="drag-drop-child" style={style1}>
                    <div className="drop-svg">
                        {SVG}
                    </div>
                    <p><span><span className="file">{file.name}</span><span className="drop-ital">[{Math.round((file.size / 1048576) * 100) / 100}Mb &rarr; {Math.round((compressedFile.size / 1048576) * 100) / 100}Mb]</span></span></p>
                </div>
                setChild(successChild)
            } catch (error) {
                onError("compress")
                console.log(error);
            }
        } else {
            onHandleFile(file)
            const successChild = <div className="drag-drop-child" style={style1}>
                <div className="drop-svg">
                    {SVG}
                </div>
                <p><span><span className="file">{file.name}</span></span></p>
            </div>
            setChild(successChild)
        }

    }

    return <div className="drag-drop" style={{color: colorText}}>
        <FileUploader 
            handleChange={handleChange} 
            name="file" 
            types={fileType} 
            hoverTitle="Deposer ici!"
            maxSize={fileSize[1]}
            minSize={fileSize[0]}
            onSizeError={() => onError("size")}
            onTypeError={() => onError("type")}
        >{child}</FileUploader>
    </div>
}
type CompType1 = {
    file: File,
    maxSizeOutput?: number,
    maxWidthOrHeightOutput?: number | undefined,
    onProgress?: Function
}
type CompType2 = {
    file: File,
    originalSize: number,
    newSise: number
}
/**
 * Fonction de compression independante
 */
export async function CompressFile({file, maxSizeOutput = 1, maxWidthOrHeightOutput = undefined, onProgress}: CompType1): Promise<Error | CompType2>{
    const progress = (n: number) => {
        if(onProgress)
        onProgress(n)
    }
    const options = {
      maxSizeMB: maxSizeOutput,
      maxWidthOrHeight: maxWidthOrHeightOutput,
      useWebWorker: true,
      onProgress: progress
    }
    try {
      const compressedFileBlob = await imageCompression(file, options)
      const compressedFile = new File([compressedFileBlob], file.name)
      return {
        file: compressedFile,
        originalSize: file.size,
        newSise: compressedFile.size
      }
    } catch (error) {
      return new Error("Compression error")
    }
}