const { traduction, defaultLang } = require('./traduction')
const t = traduction(defaultLang)

const sortLang = (lang) => {
    return {
        text1: t(lang, "mail.text1"),
        text2: t(lang, "mail.text2"),
        text3: t(lang, "mail.text3"),
        text4: t(lang, "mail.text4"),
        text5: t(lang, "mail.text5"),
        text6: t(lang, "mail.text6"),
        text7: t(lang, "mail.text7"),
        text8: t(lang, "mail.text8"),
        text9: t(lang, "mail.text9"),
        text10: t(lang, "mail.text10"),
        text11: t(lang, "mail.text11"),
        text12: t(lang, "mail.text12"),
        text13: t(lang, "mail.text13"),
        text14: t(lang, "mail.text14"),
        text15: t(lang, "mail.text15"),
        text16: t(lang, "mail.text16"),
        text17: t(lang, "mail.text17"),
        text18: t(lang, "mail.text18"),
        text19: t(lang, "mail.text19"),
        text20: t(lang, "mail.text20"),
        text21: t(lang, "mail.text21"),
        text22: t(lang, "mail.text22"),
        text23: t(lang, "mail.text23"),
        text24: t(lang, "mail.text24"),
        text25: t(lang, "mail.text25"),
        text29: t(lang, "mail.text29")
    }
}
/**
 * Ceci indique comment les variables sont recues 
 * @param {Object} data 
 * @param {string} data.id
 * @param {string} data.id_fs
 * @param {string} data.senderFirstname
 * @param {string} data.senderLastname
 * @param {string} data.description
 * @param {string} data.mesureSecurisation
 * @param {string} data.mesureConservatoire
 * @param {string} data.deadLineConservatoire
 * @param {string} data.service
 * @param {string} data.team
 * @param {string} data.responsibleSecurite
 * @param {string} data.responsibleConservatoire
 * @param {string} data.zone
 * @param {string} data.subzone
 * @param {string} data.subzone
 * @param {string} data.status
 * @param {string} data.createdAt
 * @param {string} data.updatedAt
 * @param {string} data.category
 * @param {string} data.classification
 * @param {string} data.img1
 * @param {string} data.img2
 * @param {string} data.img3
 * @param {string} data.commentaireStatus
 * @param {string} data.logo
 * @param {string} lang
 * @returns 
 */
exports.buildMailFicheSec = (data, responsable, attachments, lang) => {
    const banniere = `https://i.ibb.co/P12PVXz/banniere.jpg`//`${CLIENT_URL}/img/banniere.jpg`
    const logo = `https://i.ibb.co/6b7J3j1/logo-sodigitale.png`
    const dataMail = sortLang(lang)
    const ficheLink = `${process.env.CLIENT_URL}/FicheSecurite/traitement/${data.id}`
    const respo = `${responsable.first_name} ${responsable.last_name}`

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns:v="urn:schemas-microsoft-com:vml"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap" rel="stylesheet"></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" bgcolor="#fff" style="background-color: #fff;"><table bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family: arial, Verdana, sans-serif;"><tbody><tr><table align="center" bgcolor="#fff" width="600px" border="0" cellpadding="0" cellspacing="0" style="color: #fff;"><tbody><tr bgcolor="#fff" height="40px" style="background-color: #fff; height: 40px;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr></tbody></table><table align="center" bgcolor="#fff" width="600" height="130" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td><img src="${banniere}" style="width: 600px; height: 130px;" width="600" height="130" alt="DOPM"></td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr bgcolor="#fff" style="background-color: #fff;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #153D77;overflow-wrap: break-word; word-break: break-all; max-width: 560px; font-family: 'Open Sans', Verdana, sans-serif; line-height: 130%; mso-line-height-rule: exactly; font-size: 35px; font-weight: bold; text-align: left;">${dataMail.text1} ${respo} ! </td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" style="background: #fff;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; font-size: 18px; text-align: left;">${dataMail.text2}&nbsp;<a href="${ficheLink}"><strong>${data.id_fs}</strong></a>&nbsp;${dataMail.text3} </td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; font-size: 18px; text-align: left;">${dataMail.text4} </td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" background="#fff"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td style="vertical-align: top; width: 280px;" width="280"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text5} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text9}:&nbsp;</strong>${data.category} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text10}:&nbsp;</strong>${data.sender} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text11}:&nbsp;</strong>${data.service} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text12}:&nbsp;</strong>${data.team} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text13}:&nbsp;</strong>${data.description} </div></td><td style="vertical-align: top; width: 280px;" width="280"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text6} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text14}:&nbsp;</strong>${data.zone} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text15}:&nbsp;</strong>${data.subzone} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" style="background: #fff; height: 20px"><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td style="vertical-align: top; width: 280px;" width="280"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text7} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text16}:&nbsp;</strong>${data.mesureSecurisation} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text17}:&nbsp;</strong>${data.responsibleSecurite} </div></td><td style="vertical-align: top; width: 280px;" width="280"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text8}</div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text16}:&nbsp;</strong>${data.mesureConservatoire} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text17}:&nbsp;</strong>${data.responsibleConservatoire} </div><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text18}:&nbsp;</strong>${data.deadLineConservatoire} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td width="20" style="width: 20px;">&nbsp;</td><td><table align="center" bgcolor="#ffffff" width="540px" border="0" cellpadding="0" cellspacing="0" style="color: #fff; max-width: 560px; width: 540px;"><tbody><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[0].cid}"><img alt="" src="cid:${attachments[0].cid}" width="173"></a></td><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[1].cid}"><img alt="" src="cid:${attachments[1].cid}" width="173"></a></td><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[2].cid}"><img alt="" src="cid:${attachments[2].cid}" width="173"></a></td></tr></tbody></table></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td style="text-align: center;"><img src="${logo}" alt="DOPM LOGO" height="83" style="height: 83px;"></td></tr><tr><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#fff" width="600px" border="0" cellpadding="0" cellspacing="0" style="color: #fff;"><tbody><tr bgcolor="#fff" height="40px" style="background-color: #fff; height: 40px;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr></tbody></table></tr></tbody></table></body></html>
    `
}

/**
 * Ceci indique comment les variables sont recues 
 * @param {Object} data 
 * @param {string} data.id
 * @param {string} data.id_fs
 * @param {string} data.senderFirstname
 * @param {string} data.senderLastname
 * @param {string} data.description
 * @param {string} data.mesureSecurisation
 * @param {string} data.mesureConservatoire
 * @param {string} data.deadLineConservatoire
 * @param {string} data.service
 * @param {string} data.team
 * @param {string} data.responsibleSecurite
 * @param {string} data.responsibleConservatoire
 * @param {string} data.zone
 * @param {string} data.subzone
 * @param {string} data.subzone
 * @param {string} data.status
 * @param {string} data.createdAt
 * @param {string} data.updatedAt
 * @param {string} data.category
 * @param {string} data.classification
 * @param {string} data.img1
 * @param {string} data.img2
 * @param {string} data.img3
 * @param {string} data.commentaireStatus
 * @param {string} data.logo
 * @param {string} lang
 * @returns 
 */
exports.buildMailFicheSecUpdate = (data, dataNew, responsable, attachments, lang) => {
    const banniere = `https://i.ibb.co/P12PVXz/banniere.jpg`//`${CLIENT_URL}/img/banniere.jpg`
    const logo = `https://i.ibb.co/6b7J3j1/logo-sodigitale.png`
    const dataMail = sortLang(lang)
    const ficheLink = `${process.env.CLIENT_URL}/FicheSecurite/traitement/${data.id}`
    const respo = `${responsable.first_name} ${responsable.last_name}`

    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns:v="urn:schemas-microsoft-com:vml"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap" rel="stylesheet"></head><body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" bgcolor="#fff" style="background-color: #fff;"><table bgcolor="#fff" width="100%" border="0" cellpadding="0" cellspacing="0" style="font-family: arial, Verdana, sans-serif;"><tbody><tr><table align="center" bgcolor="#fff" width="600px" border="0" cellpadding="0" cellspacing="0" style="color: #fff;"><tbody><tr bgcolor="#fff" height="40px" style="background-color: #fff; height: 40px;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr></tbody></table><table align="center" bgcolor="#fff" width="600" height="130" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td><img src="${banniere}" style="width: 600px; height: 130px;" width="600" height="130" alt="DOPM"></td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr bgcolor="#fff" style="background-color: #fff;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #153D77;overflow-wrap: break-word; word-break: break-all; max-width: 560px; font-family: 'Open Sans', Verdana, sans-serif; line-height: 130%; mso-line-height-rule: exactly; font-size: 35px; font-weight: bold; text-align: left;">${dataMail.text1} ${respo} ! </td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" style="background: #fff;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; font-size: 18px; text-align: left;">${dataMail.text2}&nbsp;<a href="${ficheLink}"><strong>${data.id_fs}</strong></a>&nbsp;${dataMail.text19}</td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr><td width="20" style="width: 20px;">&nbsp;</td><td align="center" style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; font-size: 18px; text-align: left;">${dataMail.text4} </td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" background="#fff"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text20} </div></td><td><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text21} </div></td><td><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 20px; font-weight: bold; text-align: left;">${dataMail.text22} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" height="20px" style="background-color: #fff; height: 20px;"><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td colspan="3"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 18px; font-weight: bold; text-align: left;">${dataMail.text5}</div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text9}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.category} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.category} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text10}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.sender} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.sender} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text11}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.service} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.service} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text12}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.team} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.team} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text13}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.description} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.description} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" height="10px" style="background-color: #fff; height: 10px;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td colspan="3"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 18px; font-weight: bold; text-align: left;">${dataMail.text6} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text14}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.zone} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.zone} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text15}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.subzone} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.subzone} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" height="10px" style="background-color: #fff; height: 10px;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td colspan="3"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 18px; font-weight: bold; text-align: left;">${dataMail.text7} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text16}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.mesureSecurisation} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.mesureSecurisation} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text17}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.responsibleSecurite} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.responsibleSecurite} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" height="10px" style="background-color: #fff; height: 10px;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td colspan="3"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 18px; font-weight: bold; text-align: left;">${dataMail.text8} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text17}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.responsibleConservatoire} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.responsibleConservatoire} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text18}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.deadLineConservatoire} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.deadLineConservatoire} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" height="10px" style="background-color: #fff; height: 10px;"><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td><td height="10" style="font-size:10px; mso-line-height-rule: exactly; line-height: 10px;">&nbsp; </td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td colspan="3"><div style="color: #153D77; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 18px; font-weight: bold; text-align: left;">${dataMail.text23} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text24}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.status} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.status} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="20" style="width: 20px;">&nbsp;</td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;"><strong>${dataMail.text25}</strong></div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${data.classification} </div></td><td><div style="color: #686666; font-family: 'Open Sans', Verdana, sans-serif; line-height: 150%; mso-line-height-rule: exactly; font-size: 14px; text-align: left;">${dataNew.classification} </div></td><td width="20" style="width: 20px;">&nbsp;</td></tr><tr bgcolor="#fff" style="background: #fff; height: 20px"><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp; </td></tr><tr><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td width="20" style="width: 20px;">&nbsp;</td><td><table align="center" bgcolor="#ffffff" width="540px" border="0" cellpadding="0" cellspacing="0" style="color: #fff; max-width: 560px; width: 540px;"><tbody><tr style="overflow-wrap: break-word; max-width: 560px;"><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[0].cid}"><img alt="" src="cid:${attachments[0].cid}" width="173"></a></td><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[1].cid}"><img alt="" src="cid:${attachments[1].cid}" width="173"></a></td><td width="173px" style="width: 173px; max-width: 173px;"><a href="cid:${attachments[2].cid}"><img alt="" src="cid:${attachments[2].cid}" width="173"></a></td></tr></tbody></table></td><td width="20" style="width: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#fff" width="600px" border="0" cellpadding="0" cellspacing="0" style="color: #fff;"><tbody><tr bgcolor="#fff" height="40px" style="background-color: #fff; height: 40px;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr></tbody></table><table align="center" bgcolor="#ffffff" width="600px" border="0" cellpadding="0" cellspacing="0" style="box-shadow: 0px 4px 5px 2px rgb(88 88 88 / 14%); color: #fff;"><tbody><tr><td style="text-align: center;"><img src="${logo}" alt="DOPM LOGO" height="83" style="height: 83px;"></td></tr><tr><td height="20" style="font-size:20px; mso-line-height-rule: exactly; line-height: 20px;">&nbsp;</td></tr></tbody></table><table align="center" bgcolor="#fff" width="600px" border="0" cellpadding="0" cellspacing="0" style="color: #fff;"><tbody><tr bgcolor="#fff" height="40px" style="background-color: #fff; height: 40px;"><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td><td height="40" style="font-size:40px; mso-line-height-rule: exactly; line-height: 40px;">&nbsp; </td></tr></tbody></table></tr></tbody></table></body></html>
    `
}