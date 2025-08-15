import { PermissionsAndroid, Platform } from 'react-native'
import SmsAndroid from 'react-native-get-sms-android'
import { parseSMS } from './parseSMS'
import { Expense } from '../types/expense'

export const requestSMSPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
                title: 'SMS Permission',
                message: 'SMS Permission please to track expenses.',
                buttonPositive: 'OK',
            },
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    return false
}

// const parseBankData = (body, address) => {
//     try {

//         const bdydata = ["cr", "cr.", "dr.", "dr", "credit", "debit", "rs.", "bank", "txn"]

//         const otherBankWord = [
//             'bank', 'bk', 'credit', 'debit', 'upi', 'pay', 'icici', 'axis', 'hdfc', 'sbi', 'kotak', 'indusind',
//             'yesbank', 'citi', 'idfc', 'canara', 'paytm', 'phonepe', 'googlepay', 'bob', 'bobtxn', 'gpay'
//         ]

//         const bankKeywords = [...bdydata, ...otherBankWord]

//         const senderLower = address.toLowerCase()
//         const bodyLower = body.toLowerCase()

//         const isBankMsg = bankKeywords.some(keyword =>
//             senderLower.includes(keyword) || bodyLower.includes(keyword)
//         )

//         // if (body.includes())

//     } catch (error) {

//     }
// }

export const readBankSMS = async () => {
    return new Promise((resolve, reject) => {
        const filter = {
            box: 'inbox',
            indexFrom: 0,
            maxCount: 100,
        }

        SmsAndroid.list(JSON.stringify(filter), (fail: any) => reject(fail),
            (count: any, smsList: any) => {
                try {
                    const messages = JSON.parse(smsList)
                    console.log("reallllllllll data --------", JSON.stringify(messages))

                    const parsed = messages
                        .map((msg: any) => { return parseSMS(msg.body, msg.address) })
                        .filter((item: Expense) => item != null)

                    resolve(parsed)
                } catch (error) {
                    reject(error)
                }
            }
        )
    })
}