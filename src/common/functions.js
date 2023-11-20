
import { getData, storeData } from "../services/AsyncStorageService";
import { refreshToken } from "../services/AuthService";
import { ASYNC_DATA_KEY, ASYNC_DATA_TYPE } from "./Constants";
import Toast from 'react-native-tiny-toast';
import { PermissionsAndroid } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import strings from '../i18n/i18n'
import { ORDER_TYPE, FILE_OPTIONS } from './Constants';
import Share from "react-native-share";
import FileViewer from 'react-native-file-viewer';
import * as RNFS from 'react-native-fs';


export function validateEmail(email) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === false) {
    return false;
  } else {
    return true
  }
}

export function testPasswordStrength(password) {
  let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
  if (reg.test(password) === false) {
    return false;
  } else {
    return true
  }
}

export function toastMsg(message) {
  Toast.show(message, {
    position: -20,
    onMaskPress: closeToast,
  });
}

function closeToast() {
  Toast.hide();
}

export function dateToStr(dateObj) {
  var currentDate = dateObj;
  var year = currentDate.getFullYear(); //To get the Current Year
  var month = currentDate.getMonth() + 1; //To get the Current Month
  var date = currentDate.getDate(); //To get the Current Date
  // var hours = currentDate.getHours(); //To get the Current Hours
  // var min = currentDate.getMinutes(); //To get the Current Minutes
  // var sec = currentDate.getSeconds(); //To get the Current Seconds

  month = (month <= 9) ? '0' + month : month;
  date = (date <= 9) ? '0' + date : date;
  // hours = (hours <= 9) ? '0' + hours : hours;
  // min = (min <= 9) ? '0' + min : min;
  // sec = (sec <= 9) ? '0' + sec : sec;
  // console.log(year + '-' + month + '-' + date + 'T' + hours + ':' + min + ':' + sec)

  // console.log(year + '-' + month + '-' + date)
  return year + '-' + month + '-' + date
}

function dateDifference(){
  var result = new Date();
  result.setDate(result.getDate() - 15);


  var dateString = (result).toString()
  var dateValue = Date.parse(dateString)
  Math.floor((new Date().getTime() - Date.parse(dateString)) / (1000 * 60 * 60 * 24));
}


export function getCurrentDate() {
  var currentDate = new Date();
  var year = currentDate.getFullYear(); //To get the Current Year
  var month = currentDate.getMonth() + 1; //To get the Current Month
  var date = currentDate.getDate(); //To get the Current Date
  var hours = currentDate.getHours(); //To get the Current Hours
  var min = currentDate.getMinutes(); //To get the Current Minutes
  var sec = currentDate.getSeconds(); //To get the Current Seconds

  month = (month <= 9) ? '0' + month : month;
  date = (date <= 9) ? '0' + date : date;
  hours = (hours <= 9) ? '0' + hours : hours;
  min = (min <= 9) ? '0' + min : min;
  sec = (sec <= 9) ? '0' + sec : sec;
  console.log(year + '-' + month + '-' + date + 'T' + hours + ':' + min + ':' + sec)

  // console.log(year + '-' + month + '-' + date)
  return year + '-' + month + '-' + date + 'T' + hours + ':' + min + ':' + sec
}

export function isStringEmpty(input) {
  return typeof input === 'undefined' || input === null || input.length === 0;
}

export function padLeadingZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

async function permissionCheck() {
  const grantedW = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  const grantedR = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

  if (grantedW === PermissionsAndroid.RESULTS.GRANTED && grantedR === PermissionsAndroid.RESULTS.GRANTED) {
    return true
  } else {
    return false
  }
}

export async function writeJsonToFile(json, path) {
  if (await permissionCheck()) {
    return await RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/' + path, JSON.stringify(json), 'utf8')
      .then(async (success) => {
        // console.log('saving success')
        return true
      }).catch(err => {
        console.log(err.message, err.code);
        return false
      });
  } else {
    return false
  }
}

export async function readJsonFromFile(path) {
  if (await permissionCheck()) {
    return await RNFS.readFile(RNFS.ExternalStorageDirectoryPath + '/' + path, 'utf8')
      .then(async (contents) => {
        return JSON.parse(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
        return ''
      });
  } else {
    return false
  }


}
export async function isFileExist(filePath) {
  if (await permissionCheck()) {
    return await RNFS.exists(RNFS.ExternalStorageDirectoryPath + '/' + filePath)
      .then((result) => {
        return result
      })
  } else {
    return false
  }
}
export async function deleteFile(filePath) {
  if (await permissionCheck()) {
    return await RNFS.unlink(RNFS.ExternalStorageDirectoryPath + '/' + filePath)
      .then(() => {
        // console.log("FILE DELETED")
        return true
      })
      .catch((err) => {
        console.log(err)
        return false
      })
  } else {
    return false
  }
}

export async function getFileDetail(filePath, fileName) {
  if (await permissionCheck()) {
    return await RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/' + 'Downloads')
      .then((result) => {
        var backupFile = ''
        backupFile = Object.entries(result).filter(([key, file]) => file.name == fileName).map(([key, file]) => file)
        if (backupFile.length > 0) {
          return backupFile[0]
        } else {
          return false
        }
      }).catch((err) => {
        console.log(err)
        return false
      })
  } else {
    return false
  }
}

export function openOrderPDF(pdf_url) {
  FileViewer.open(pdf_url)
    .then(() => {
      // console.log('File opened')
    })
    .catch(error => {
      toastMsg(strings.PDF_NOT_EXIST_MSG)
    });
}

export async function shareOrderPDF(pdf_url, fileName, orderType, companyName) {
  if (isStringEmpty(pdf_url)) {
    toastMsg(strings.PDF_NOT_EXIST_MSG)
    return
  }
  // var path = pdf_url
  // var base64 = await RNFS.readFile(path, 'base64');

  let obj = {
    title: "React Native",
    message: strings.PDF_EMAIL_MSG,
    type: 'application/pdf',
    url: 'data:application/pdf;base64,' + pdf_url,
    // subject: orderType.toString() + ' ' + fileName + ' ' + strings.FROM + ' ' + companyName
  };

  if (fileName) {
    obj.filename = fileName
  }
  
  Share.open(obj).catch((err) => {
    console.log(err)
    // toastMsg(strings.PDF_NOT_EXIST_MSG)
  });
}

export async function generateOrderPDF(order, type) {
  const grantedW = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  const grantedR = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

  if (grantedW === PermissionsAndroid.RESULTS.GRANTED && grantedR === PermissionsAndroid.RESULTS.GRANTED) {
    var htmlStr = ''
    if (type == ORDER_TYPE.DO) {
      htmlStr = await generateDeliveryOrderHTML(order)
    } else if (type === ORDER_TYPE.INVOICE) {
      htmlStr = await generateInvoiceHTML(order)
    } else {
      return
    }

    while (htmlStr.indexOf('#') !== -1) {
      htmlStr = htmlStr.toString().replace("#", "&num;")
    }

    let options = {
      html: htmlStr,
      // Setting UP File Name for PDF File.
      fileName: order.orderNumber,

      //File directory in which the PDF File Will Store.
      directory: FILE_OPTIONS.PDF_DIRECTORY,
    };

    let file = await RNHTMLtoPDF.convert(options);

    toastMsg(order.orderNumber + ' ' + strings.GENERATED)
    return file.filePath
  }
}

async function generateInvoiceHTML(order) {
  var htmlStr = ''

  htmlStr += `<div style="width:750px;font-family: Arial, Helvetica, sans-serif;">`
  htmlStr += `<div style="height:70px; width:750px;"><h1 style="color:SteelBlue;font-size:40px;padding:20px;text-align:center">` + strings.INVOICE.toUpperCase() + `</h1></div>`
  htmlStr += `<div style="height:230px; width:750px;">`
  htmlStr += `<table style="height:230px;width:100%;">`
  htmlStr += `<tr><td style="height:30px;vertical-align: bottom;"><b>` + strings.FROM.toUpperCase() + `:</b></td>`
  htmlStr += `<td style="height:30px;vertical-align: bottom;text-align:right;"><b>` + strings.TO.toUpperCase() + `:</b></td></tr>`
  htmlStr += `<tr><td style="width:50%;vertical-align:top;padding-top:10px;"><h3>` + order.companyProfile.companyName + `</h3>`
  htmlStr += `<p>`
  if (!isStringEmpty(order.companyProfile.addr1)) {
    htmlStr += order.companyProfile.addr1 + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.addr2)) {
    htmlStr += order.companyProfile.addr2 + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.addr3)) {
    htmlStr += order.companyProfile.addr3 + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.addr4)) {
    htmlStr += order.companyProfile.addr4 + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.postCode)) {
    htmlStr += order.companyProfile.country + ' ' + order.companyProfile.postCode + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.phone)) {
    htmlStr += strings.PHONE + ':' + order.companyProfile.phone + ' '
  }
  if (!isStringEmpty(order.companyProfile.fax)) {
    htmlStr += strings.FAX + ':' + order.companyProfile.fax + ' '
  }
  if (!isStringEmpty(order.companyProfile.phone) || !isStringEmpty(order.companyProfile.fax)) {
    htmlStr += `<br>`
  }
  if (!isStringEmpty(order.companyProfile.email)) {
    htmlStr += strings.EMAIL + ':' + order.companyProfile.email + `<br>`
  }
  if (!isStringEmpty(order.companyProfile.brn)) {
    htmlStr += strings.BRN + ':' + order.companyProfile.brn + `<br>`
  }
  htmlStr += `</p></td>`

  htmlStr += `<td style="width:50%;text-align:right;vertical-align:top;padding-top:10px;"><h3>` + order.client.clientCompanyName + `</h3>`
  htmlStr += `<p>`
  if (!isStringEmpty(order.client.addr1)) {
    htmlStr += order.client.addr1 + `<br>`
  }
  if (!isStringEmpty(order.client.addr2)) {
    htmlStr += order.client.addr2 + `<br>`
  }
  if (!isStringEmpty(order.client.addr3)) {
    htmlStr += order.client.addr3 + `<br>`
  }
  if (!isStringEmpty(order.client.addr4)) {
    htmlStr += order.client.addr4 + `<br>`
  }
  if (!isStringEmpty(order.client.postCode)) {
    htmlStr += order.client.country + ' ' + order.client.postCode + `<br>`
  }
  if (!isStringEmpty(order.client.phone)) {
    htmlStr += strings.PHONE + ':' + order.client.phone + ' '
  }
  if (!isStringEmpty(order.client.fax)) {
    htmlStr += strings.FAX + ':' + order.client.fax + ' '
  }
  if (!isStringEmpty(order.client.phone) || !isStringEmpty(order.client.fax)) {
    htmlStr += `<br>`
  }
  if (!isStringEmpty(order.client.email)) {
    htmlStr += strings.EMAIL + ':' + order.client.email + `<br>`
  }

  htmlStr += `<b>` + strings.ATTN_TO + ':' + order.client.attn + `</b></p></td></tr></table></div>`
  htmlStr += `<div style = "height:80px; width:750px;margin-bottom: 10px;"><table style="height:80px;width:100%;">`
  htmlStr += `<tr>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue;width:50%;vertical-align: center;">`
    + strings.ORDER_NUMBER.toUpperCase() + ':<b>' + order.orderNumber + `</b></td>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue; width:50%;vertical-align: center;text-align:left;">`
    + strings.DELIVERY_DATE.toUpperCase() + ':<b>' + order.deliveryDate + `</b></td>`
  htmlStr += `</tr>`
  htmlStr += `<tr>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue;width:50%;vertical-align: center;">`
    + strings.INVOICE_DATE.toUpperCase() + ':<b>' + order.invoiceDate + `</b></td>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue; width:50%;vertical-align: center;text-align:left;">`
    + strings.PAYMENT_DUE_DATE.toUpperCase() + ':<b>' + order.paymentDueDate + `</b></td>`
  htmlStr += `</tr>`


  htmlStr += `</table></div>`

  htmlStr += `<div style="width:750px;margin-bottom: 10px;"><table style="width:100%;">`
  htmlStr += `<tr style="height:40px;">`
  htmlStr += `<th style="border: 1px solid white; width: 60px; background-color:steelblue;vertical-align: center;text-align: center; color:white ">` + strings.NO + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 200px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:left;color:white">` + strings.PRODUCT_NUMBER + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 250px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:left;color:white">` + strings.DESCRIPTION + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 80px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:center;color:white">` + strings.QUANTITY_FULL + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 80px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:center;color:white">` + strings.PRICE + `<br>` + order.companyProfile.currency + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 80px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:center;color:white">` + strings.TOTAL + `<br>` + order.companyProfile.currency + `</th>`
  htmlStr += `</tr>`

  for (let product of order.productList) {
    htmlStr += `<tr style="height:40px;">`
    htmlStr += `<td style="width: 60px; vertical-align: center;text-align: center;">` + (Number(product.sequence) + 1) + `</td>`
    htmlStr += `<td style="width: 200px; padding-left: 10px; vertical-align: center;text-align:left;">` + product.productNumber + `</td>`
    htmlStr += `<td style="width: 250px; padding-left: 10px; vertical-align: center;text-align:left;">` + product.description + `</td>`
    htmlStr += `<td style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;">` + product.quantity + product.UOM + `</td>`
    htmlStr += `<td style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;">` + product.unitPrice + `</td>`
    htmlStr += `<td style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;">` + product.totalPrice + `</td>`
    htmlStr += `</tr>`
    if (!isStringEmpty(product.remark)) {
      htmlStr += `<tr style="height:30px;"><td style="width: 60px;"> </td>`
      htmlStr += `<td style="width: 200px; padding-left: 10px; vertical-align:top;text-align:left;"><i>` + strings.REMARKS + `</i></td>`
      htmlStr += `<td colspan="4" style="width: 490px; padding-left: 10px; vertical-align: top;text-align:left;"><i>` + product.remark + `</i></td>`
      htmlStr += `</tr>`
    }
  }
  htmlStr += `</table>`

  htmlStr += `<div style="width:100%;border-top: 1px solid black;">`
  htmlStr += `<table style="width:100%;">`
  htmlStr += `<tr style="height:40px;">`
  htmlStr += `<th style="width: 60px; vertical-align: center;text-align: center;"></th>`
  htmlStr += `<th style="width: 200px; padding-left: 10px; vertical-align: center;text-align:left;"></th>`
  htmlStr += `<th style="width: 250px; padding-left: 10px; vertical-align: center;text-align:left;">` + strings.TOTAL + `</th>`
  htmlStr += `<th style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;">` + order.totalQuantity + `</th>`
  htmlStr += `<th style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;"></th>`
  htmlStr += `<th style="width: 80px; padding-left: 10px; vertical-align: center;text-align:center;">` + order.companyProfile.currency + order.totalPrice + `</th>`
  htmlStr += `</tr></table></div>`


  htmlStr += `<div style="width:750px;margin-bottom: 10px;border-top: 1px solid black;">`

  if (order.deliveryTerms.length > 0) {
    htmlStr += `<p><i><b>` + strings.DELIVERY_TERMS + `:</b>` + order.deliveryTerms[0].terms + `</i></p>`
  }
  if (order.paymentTerms.length > 0) {
    htmlStr += `<p><i><b>` + strings.PAYMENT_TERMS + `:</b>` + order.paymentTerms[0].terms + `</i></p>`
  }
  if (order.generalTerms.length > 0) {
    htmlStr += `<p><i><b>` + strings.GENERAL_TERMS + `:</b>` + order.generalTerms[0].terms + `</i></p>`
  }
  htmlStr += `</div>`

  // if (NO_ADS != 'true') {
  //   htmlStr += `<div style="width:750px;margin-bottom: 10px;border-top: 1px solid black;"><p><i style="color: SteelBlue;">` + strings.PDF_APP_FOOTER + `</i></p></div>`
  // }

  htmlStr += `</div></div></div>`

  return htmlStr
}

async function generateDeliveryOrderHTML(order) {
  var htmlStr = ''

  htmlStr += `<div style="width:750px;font-family: Arial, Helvetica, sans-serif;">`
  htmlStr += `<div style="height:70px; width:750px;"><h1 style="color:SteelBlue;font-size:40px;padding:20px;text-align:center">` + strings.DELIVERY_ORDER.toUpperCase() + `</h1></div>`
  htmlStr += `<div style="height:230px; width:750px;">`
  htmlStr += `<table style="height:230px;width:100%;">`
  htmlStr += `<tr><td style="height:30px;vertical-align: bottom;"><b>` + strings.FROM.toUpperCase() + `:</b></td>`
  htmlStr += `<td style="height:30px;vertical-align: bottom;text-align:right;"><b>` + strings.TO.toUpperCase() + `:</b></td></tr>`
  htmlStr += `<tr><td style="width:50%;vertical-align:top;padding-top:10px;"><h3>` + (order?.company?.name?.replace("#", "&num;") || '') + `</h3>`
  htmlStr += `<p>`
  if (!isStringEmpty(order?.company?.addr1)) {
    htmlStr += order?.company?.addr1.replace("#", "&num;") + `<br>`
  }
  if (!isStringEmpty(order?.company?.addr2)) {
    htmlStr += order?.company?.addr2.replace("#", "&num;") + `<br>`
  }
  if (!isStringEmpty(order?.company?.addr3)) {
    htmlStr += order?.company?.addr3.replace("#", "&num;") + `<br>`
  }
  if (!isStringEmpty(order?.company?.addr4)) {
    htmlStr += order?.company?.addr4.replace("#", "&num;") + `<br>`
  }
  if (!isStringEmpty(order?.company?.postCode)) {
    htmlStr += order?.company?.country + ' ' + order?.company?.postCode + `<br>`
  }
  if (!isStringEmpty(order?.company?.contactNumber)) {
    htmlStr += strings.PHONE + ':' + order?.company?.contactNumber + ' '
  }
  if (!isStringEmpty(order?.company?.fax)) {
    htmlStr += strings.FAX + ':' + order?.company?.fax + ' '
  }
  if (!isStringEmpty(order?.company?.contactNumber) || !isStringEmpty(order?.company?.fax)) {
    htmlStr += `<br>`
  }
  if (!isStringEmpty(order?.company?.email)) {
    htmlStr += strings.EMAIL + ':' + order?.company?.email + `<br>`
  }
  if (!isStringEmpty(order?.company?.brn)) {
    htmlStr += strings.BRN + ':' + order?.company?.brn + `<br>`
  }
  htmlStr += `</p></td>`

  htmlStr += `<td style="width:50%;text-align:right;vertical-align:top;padding-top:10px;"><h3>` + order?.client?.[0]?.name + `</h3>`
  htmlStr += `<p>`
  if (!isStringEmpty(order?.client?.[0]?.addr1)) {
    htmlStr += order?.client?.[0]?.addr1 + `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.addr2)) {
    htmlStr += order?.client?.[0]?.addr2 + `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.addr3)) {
    htmlStr += order?.client?.[0]?.addr3 + `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.addr4)) {
    htmlStr += order?.client?.[0]?.addr4 + `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.contactNumber)) {
    htmlStr += order?.client?.[0]?.country + ' ' + order?.client?.[0]?.postCode + `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.contactNumber)) {
    htmlStr += strings.PHONE + ':' + order?.client?.[0]?.contactNumber + ' '
  }
  if (!isStringEmpty(order?.client?.[0]?.fax)) {
    htmlStr += strings.FAX + ':' + order?.client?.[0]?.fax + ' '
  }
  if (!isStringEmpty(order?.client?.[0]?.contactNumber) || !isStringEmpty(order?.client?.[0]?.fax)) {
    htmlStr += `<br>`
  }
  if (!isStringEmpty(order?.client?.[0]?.email)) {
    htmlStr += strings.EMAIL + ':' + order?.client?.[0]?.email + `<br>`
  }

  htmlStr += `<b>` + strings.ATTN_TO + ':' + (order?.client?.[0]?.remark || '') + `</b></p></td></tr></table></div>`
  htmlStr += `<div style = "height:40px; width:750px;margin-bottom: 10px;"><table style="height:40px;width:100%;"><tr>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue;width:50%;vertical-align: center;">`
    + strings.ORDER_NUMBER.toUpperCase() + ':<b>' + order?.orderNumber + `</b></td>`
  htmlStr += `<td style="padding-left: 10px; background-color:powderblue; width:50%;vertical-align: center;text-align:left;">`
    + strings.DELIVERY_DATE.toUpperCase() + ':<b>' + new Date(order?.deliveryDate).toLocaleDateString() + `</b></td>`
  htmlStr += `</tr></table></div>`

  htmlStr += `<div style="width:750px;margin-bottom: 10px;"><table style="width:100%;">`
  htmlStr += `<tr style="height:40px;">`
  htmlStr += `<th style="border: 1px solid white; width: 70px; background-color:steelblue;vertical-align: center;text-align: center; color:white ">` + strings.NO + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 200px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:left;color:white">` + strings.PRODUCT_NUMBER + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 380px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:left;color:white">` + strings.DESCRIPTION + `</th>`
  htmlStr += `<th style="border: 1px solid white;width: 100px; padding-left: 10px; background-color:steelblue; vertical-align: center;text-align:left;color:white">` + strings.QUANTITY_FULL + `</th>`
  htmlStr += `</tr>`

  for (let product of order.items) {
    htmlStr += `<tr style="height:40px;">`
    htmlStr += `<td style="width: 70px; vertical-align: center;text-align: center;">` + (Number(product?.sequence) + 1) + `</td>`
    htmlStr += `<td style="width: 200px; padding-left: 10px; vertical-align: center;text-align:left;">` + product?.name + `</td>`
    htmlStr += `<td style="width: 380px; padding-left: 10px; vertical-align: center;text-align:left;">` + product?.description + `</td>`
    htmlStr += `<td style="width: 100px; padding-left: 10px; vertical-align: center;text-align:left;">` + product?.quantity + product?.uom + `</td>`
    htmlStr += `</tr>`
    if (!isStringEmpty(product?.remark)) {
      htmlStr += `<tr style="height:30px;"><td style="width: 70px;"> </td>`
      htmlStr += `<td style="width: 200px; padding-left: 10px; vertical-align:top;text-align:left;"><i>` + strings.REMARKS + `</i></td>`
      htmlStr += `<td colspan="2" style="width: 480px; padding-left: 10px; vertical-align: top;text-align:left;"><i>` + product?.remark + `</i></td>`
      htmlStr += `</tr>`
    }
  }
  htmlStr += `</table>`

  htmlStr += `<div style="width:100%;border-top: 1px solid black;">`
  htmlStr += `<table style="width:100%;">`
  htmlStr += `<tr style="height:40px;">`
  htmlStr += `<th colSpan="3" style="width: 650px; vertical-align: center;text-align: center; ">` + strings.TOTAL + `</th>`
  htmlStr += `<th style="width: 100px; padding-left: 10px; vertical-align: center;text-align:left;">` + order?.totalQuantity + `</th>`
  htmlStr += `</tr></table></div>`

  htmlStr += `<div style="width:750px;margin-bottom: 10px;border-top: 1px solid black;">`

  for (let term of order.terms) {
    if (term?.type === "DELIVERY") {
      htmlStr += `<p><i><b>` + strings.DELIVERY_TERMS + `:</b>` + term?.name + `</i></p>`
    }
    if (term?.type === "PAYMENT") {
      htmlStr += `<p><i><b>` + strings.PAYMENT_TERMS + `:</b>` + term?.name + `</i></p>`
    }
    if (term?.type === "GENERAL") {
      htmlStr += `<p><i><b>` + strings.GENERAL_TERMS + `:</b>` + term?.name + `</i></p>`
    }
  }
  // if (order?.terms?.length > 0) {
  //   htmlStr += `<p><i><b>` + strings.DELIVERY_TERMS + `:</b>` + order.deliveryTerms[0].terms + `</i></p>`
  // }
  // if (order.paymentTerms.length > 0) {
  //   htmlStr += `<p><i><b>` + strings.PAYMENT_TERMS + `:</b>` + order.paymentTerms[0].terms + `</i></p>`
  // }
  // if (order.generalTerms.length > 0) {
  //   htmlStr += `<p><i><b>` + strings.GENERAL_TERMS + `:</b>` + order.generalTerms[0].terms + `</i></p>`
  // }
  htmlStr += `</div>`

  // console.log(NO_ADS)
  // if (NO_ADS != 'true') {
  //   htmlStr += `<div style="width:750px;margin-bottom: 10px;border-top: 1px solid black;"><p><i style="color: SteelBlue;">` + strings.PDF_APP_FOOTER + `</i></p></div>`
  // }
  htmlStr += `</div></div></div>`

  return htmlStr
}

// axios.interceptors.response.use(response => {
//   console.log('Response:', JSON.stringify(response, null, 2))
//   return response
// })

// export const GetAuthHeader = async () => {
//   let token = await getData(ASYNC_DATA_KEY.LSUSERTOKEN)
//   let tenantId = await getData(ASYNC_DATA_KEY.LSUSERTENANT)

//   return {
//     'Authorization': `Bearer ${token}`,
//     'tenantId': tenantId,
//   }
// }

export const GetAuthHeader = () => {
  Promise.all(getData(ASYNC_DATA_KEY.LSUSERTOKEN), getData(ASYNC_DATA_KEY.LSUSERTENANT)).then(
    (res) => {
      const token = res[1]
      const tenantId = res[2]

      return {
        Authorization: `Bearer ${token}`,
        tenantId: tenantId,
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json, text/plain, /'
      };
    }
  );
};

export const GetAuthHeaderForFileUpload = () => {
  Promise.all(getData(ASYNC_DATA_KEY.LSUSERTOKEN), getData(ASYNC_DATA_KEY.LSUSERTENANT)).then(
    (res) => {
      const token = res[1]
      const tenantId = res[2]

      return {
        Authorization: `Bearer ${token}`,
        tenantId: tenantId,
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
        'Content-Type': 'multipart/form-data',
        // 'Accept': 'application/json, text/plain, /'
      };
    }
  );
};

export function RefreshTokenIfNeed() {
  var fc = async () => {
    var expiring = Number(await getData(ASYNC_DATA_KEY.LSTOKENEXPIRE, ASYNC_DATA_TYPE.VALUE)) - (30 * 60 * 1000) < new Date().getTime()
    var token = await getData(ASYNC_DATA_KEY.LSUSERREFRESHTOKEN, ASYNC_DATA_TYPE.VALUE)

    //token有效不到30分钟时自动刷新token
    if (expiring && token) {
      var response = await refreshToken(token)
      console.log('refresh')
      if (response.status === 200 && response.data.code === "SUCCESS") {
        await storeData(ASYNC_DATA_KEY.LSUSERTOKEN, response.data.data.token, ASYNC_DATA_TYPE.VALUE)
        await storeData(ASYNC_DATA_KEY.LSTOKENEXPIRE, '' + response.data.data.expiration_time, ASYNC_DATA_TYPE.VALUE)
        return Promise.resolve(response.data.data)
      }
    }
    return Promise.resolve(null);
  };
  return fc()
  // throttled(fc, 500)();
}

export function randomNumberInRange(min, max) {
  // 👇️ get number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


