import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faEraser, faPen } from "@fortawesome/free-solid-svg-icons"
import { forwardRef, useCallback, useEffect, useRef, useState, RefObject, ReactElement, RefAttributes } from "react"
import { Input, Popover, PopoverBody, PopoverHeader } from "reactstrap"
import { FormGroup } from "@mui/material"

const api = process.env.REACT_APP_PUBLIC_URL
type Action = 'setting' | 'draw' | 'eraser'

class DrawingCanvas{
    canvas: HTMLCanvasElement
    w: number
    h: number
    ctx: CanvasRenderingContext2D | null
    draw: boolean
    prevX: number
    prevY: number
    color: string
    lineWidth: number
    action: Action
    eraser: {
        elt: HTMLDivElement | null,
        width: number
    }
    defaultImage: HTMLImageElement | undefined

    constructor(canvas: HTMLCanvasElement, img: HTMLImageElement | null, defaultImage?: HTMLImageElement){
        this.canvas = canvas
        this.w = img?.width || 0
        this.h = img?.height || 0
        this.ctx = canvas.getContext('2d')
        this.action = 'draw'
        this.draw = false
        this.prevX = 0
        this.prevY = 0
        this.color = '#0091ff'
        this.lineWidth = 3
        this.defaultImage = defaultImage
        this.eraser = {
            elt: document.querySelector<HTMLDivElement>('#eraser'),
            width: 20
        }
        this.initEraser()
        this.buildEraser(false)

        this.mousedown = this.mousedown.bind(this)
        this.mousemove = this.mousemove.bind(this)
        this.mouseup = this.mouseup.bind(this)
        this.mouseout = this.mouseout.bind(this)

        this.canvas.addEventListener('mousedown', this.mousedown)
        this.canvas.addEventListener('mousemove', this.mousemove)
        this.canvas.addEventListener("mouseup", this.mouseup)
        this.canvas.addEventListener("mouseout", this.mouseout)
    }

    mousedown(e: MouseEvent){
        this.draw = true
        this.prevX = (e.clientX - this.canvas.getBoundingClientRect().left) * this.w / this.canvas.getBoundingClientRect().width
        this.prevY = (e.clientY - this.canvas.getBoundingClientRect().top) * this.h / this.canvas.getBoundingClientRect().height
        if(this.action === "eraser"){
            this.clear(this.prevX, this.prevY)
        }
    }
    mousemove(e: MouseEvent){
        if(this.action === "eraser"){
            this.buildEraser(true, e.clientX, e.clientY)
        }
        if(this.draw){
            let currX = (e.clientX - this.canvas.getBoundingClientRect().left) * this.w / this.canvas.getBoundingClientRect().width
            let currY = (e.clientY - this.canvas.getBoundingClientRect().top) * this.h / this.canvas.getBoundingClientRect().height
            if(this.action === "draw"){
                this.dessine(this.prevX, this.prevY, currX, currY)
            }else if(this.action === "eraser"){
                this.clear(currX, currY)
            }
            this.prevX = currX
            this.prevY = currY
        }
    }
    mouseup(){
        this.draw = false
    }
    mouseout(){
        this.draw = false
        if(this.action === "eraser"){
            this.buildEraser(false)
        }
    }
    removeEvents(){
        this.canvas.removeEventListener('mousedown', this.mousedown)
        this.canvas.removeEventListener('mousemove', this.mousemove)
        this.canvas.removeEventListener("mouseup", this.mouseup)
        this.canvas.removeEventListener("mouseout", this.mouseout)
    }

    dessine(depX: number, depY: number, desX: number, desY: number){
        if(this.ctx){
            this.ctx.strokeStyle = this.color
            this.ctx.lineWidth = this.lineWidth
            this.ctx.beginPath()
            this.ctx.moveTo(depX, depY)
            this.ctx.lineTo(desX, desY)
            this.ctx.closePath()
            this.ctx.stroke()
        }
    }

    clear(x: number, y: number){
        if(this.ctx){
            this.ctx.clearRect(
                x - this.eraser.width / 2,
                y - this.eraser.width / 2,
                this.eraser.width,
                this.eraser.width
            )
        }
    }

    clearAll(){
        if(this.ctx){
            this.ctx.clearRect(0, 0, this.w, this.h)
        }
    }

    changeColor(color: string){
        this.color = color
    }

    changeWidth(w: number){
        this.lineWidth = w
    }

    changeThinckEraser(t: number){
        this.eraser = {...this.eraser, width: t}
        this.initEraser()
    }

    setAction(action: Action){
        this.action = action
        if(action !== "eraser"){
            this.buildEraser(false)
        }
    }

    buildEraser(visible: boolean = true, x: number = 0, y: number = 0){
        if(visible){
            if(this.eraser.elt) {
                this.eraser.elt.style.display = 'block'
                this.eraser.elt.style.left = `${x - this.canvas.getBoundingClientRect().left - this.eraser.width / 2}px`
                this.eraser.elt.style.top = `${y - this.canvas.getBoundingClientRect().top - this.eraser.width / 2}px`
            }
        }else{
            if(this.eraser.elt) {
                this.eraser.elt.style.display = 'none'
            }
        }
    }

    initEraser(){
        if(!this.eraser.elt) return
        this.eraser.elt.style.position = `absolute`
        this.eraser.elt.style.width = `${this.eraser.width}px`
        this.eraser.elt.style.height = `${this.eraser.width}px`
        this.eraser.elt.style.background = `#fff`
        this.eraser.elt.style.pointerEvents = `none`
        this.eraser.elt.style.border = `1px solid #000`
    }

    setDimensions(w: number, h: number){
        this.w = w
        this.h = h
    }

    setDefaultImage(img: HTMLImageElement){
        this.defaultImage = img
        img.onload = () => {
            this.ctx?.drawImage(img, 0, 0, this.w, this.h)
        }
    }
}

type DrawLesionType = {
    imgModel: string,
    defaultImage?: string
}

declare module "react" {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: RefObject<T>) => ReactElement | null
    ): (props: P & RefAttributes<T>) => ReactElement | null
}

const DrawLesion = forwardRef<HTMLCanvasElement, DrawLesionType>((props, ref) => {
    const {imgModel, defaultImage} = props

    const img = useRef<HTMLImageElement>(null)

    const [color, setColor] = useState('#0091ff')
    const [thickness, setThickness] = useState(3)
    const [thickEraser, setThickEraser] = useState(20)
    const paper = useRef<{instance: DrawingCanvas | null}>({instance: null})
    const [action, setAction] = useState<Action>('draw')

    const innitDimensions = useCallback(() => {
        const width = img.current?.width
        const height = img.current?.height
        if(!(ref && ref.current && width && height)) return
        ref.current.width = width? width: 0
        ref.current.height = height? height: 0
        paper.current.instance?.setDimensions(width, height)
    }, [paper.current.instance])

    useEffect(() => {
        const defaultImageElt = document.getElementById("defaultimage") as HTMLImageElement
        if(ref && ref.current && paper.current.instance === null){
            paper.current.instance = new DrawingCanvas(ref.current, img.current, defaultImageElt)
            innitDimensions()
            if(defaultImage) paper.current.instance.setDefaultImage(defaultImageElt)
        }
        window.addEventListener('resize', innitDimensions)

        return () => {
            //paper.current.instance?.removeEvents()
            window.removeEventListener('resize', innitDimensions)
        }
    }, [innitDimensions])

    useEffect(() => {
        if(paper.current.instance && ref && ref.current){
            const ctx = ref.current.getContext("2d")
            ctx?.clearRect(0, 0, ref.current.width, ref.current.height)
            const defaultImageElt = document.getElementById("defaultimage") as HTMLImageElement
            paper.current.instance.setDefaultImage(defaultImageElt)
        }
    }, [defaultImage])

    useEffect(() => {
        paper.current.instance?.changeColor(color)
        paper.current.instance?.changeWidth(thickness)
        paper.current.instance?.changeThinckEraser(thickEraser)
    }, [color, thickness, thickEraser])

    useEffect(() => {
        paper.current.instance?.setAction(action)
    }, [action])

    const [popoverOpen, setPopoverOpen] = useState(false)
    const btn = useRef<HTMLSpanElement>(null)

    return <>
    <div className="position-relative">
        <span
            className="position-absolute"
            style={{zIndex: 10, top: 5, right: 5}}
            ref={btn}
            onClick={() => {
                setPopoverOpen(p => !p)
                setAction("setting")
            }}
        >
            <FontAwesomeIcon
                icon={faCog}
                size="lg"
                color={action === 'setting'? "var(--primary)": "var(--gray-dark)"}
            />
        </span>
        <span
            className="position-absolute"
            style={{zIndex: 10, top: 32, right: 5}}
            onClick={() => {
                setAction("draw")
            }}
        >
            <FontAwesomeIcon
                icon={faPen}
                size="lg"
                color={action === 'draw'? "var(--primary)": "var(--gray-dark)"}
            />
        </span>
        <span
            className="position-absolute"
            style={{zIndex: 10, top: 60, right: 5}}
            onClick={() => {
                setAction("eraser")
            }}
        >
            <FontAwesomeIcon
                icon={faEraser}
                size="lg"
                color={action === 'eraser'? "var(--primary)": "var(--gray-dark)"}
            />
        </span>
        <div style={{position: 'relative'}}>
            <div id="eraser" style={{zIndex: 6}}></div>
            <canvas className="position-absolute" ref={ref} style={{zIndex: 5, width: "100%", aspectRatio: "calc(552/556)"}}>
            </canvas>
            <img ref={img} src={imgModel} alt="human" style={{width: "100%", aspectRatio: "calc(552/556)"}}/>
            <img

                src={(api && defaultImage)? api + defaultImage: ""}
                alt=""id="defaultimage"
                /*crossOrigin="anonymous"*/
                style={{width: "100%", aspectRatio: "calc(552/556)", position: "absolute", zIndex: "-1", left: 0}}
            />
        </div>
    </div>
    <Popover
        target={btn}
        isOpen={popoverOpen}
        trigger="focus"
        placement="bottom"
    >
        <PopoverHeader>
            Dessin
        </PopoverHeader>
        <PopoverBody>
            <FormGroup>
                <label htmlFor="color">Couleur: {color}</label>
                <Input
                    id="color"
                    type="color"
                    onChange={(e) => {
                        setColor(e.target.value)
                    }}
                    value={color}
                />
            </FormGroup>
            <FormGroup>
                <label htmlFor="thickness">Épaisseur: {thickness}</label>
                <Input
                    id="thickness"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    onChange={(e) => {
                        setThickness(parseInt(e.target.value))
                    }}
                    value={`${thickness}`}
                />
            </FormGroup>
            <FormGroup>
                <label htmlFor="thickEraser">Gomme: {thickEraser}</label>
                <Input
                    id="thickEraser"
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    onChange={(e) => {
                        setThickEraser(parseInt(e.target.value))
                    }}
                    value={`${thickEraser}`}
                />
            </FormGroup>
        </PopoverBody>
    </Popover>
    </>
})

export default DrawLesion
