// @ts-ignore
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import imageCompression from 'browser-image-compression';
import RequestService from '../services/request';
const pdfMake = require('pdfmake/build/pdfmake.min');

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export const exportFSToPDF = (data: any[], header: any[], footer: any[]) => {
  let docDefinition = {
    pageOrientation: 'portrait',
    content: data
  }
  header.forEach((e) => {
    docDefinition.content.unshift(e);
  });
  footer.forEach((e) => {
    docDefinition.content.push(e);
  })
  pdfMake.createPdf(docDefinition).print();
}
const toDataURL = async (url: string) => {
  /**
   * On genere le base64 en backend
   */
  let req = new RequestService()
  const res = await req.fetchEndpoint("fiche-image", "POST", {url: url});
  const base64 = res?.data.base64
  return base64
}
  

export const getBase64Image = async (imgUrl: string): Promise<string> => {

  return toDataURL(imgUrl)
  .then((dataUrl: any) => {
    /**
     * On genere le base64(image/webp) à partir de l'url avec la fonction toDataURL
     * On genere en meme temps le fichier image/webp 
     */
    return imageCompression.getFilefromDataUrl(dataUrl, `${imgUrl.split('/').at(-1)}`)
  })
  .then(async (file: File) => {
    /**
     * On fait une fausse compression 
     * juste pour convertir l'image/webp en image/jpeg
     * car la librairie pdfmake n'accepte que image/jpeg et image/png
     */
    const options = {
      maxWidthOrHeight: 512,
      fileType: 'image/jpeg',
      useWebWorker: true
    }
    return await imageCompression(file, options)
  })
  .then((file) => {
    /**
     * On recupere l'url base64 image/jpeg à partir du fichier converti
     */
    return imageCompression.getDataUrlFromFile(file)
  })
}
