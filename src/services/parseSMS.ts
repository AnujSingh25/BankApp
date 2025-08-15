export const parseSMS = (body: string, sender: string) => {
    try {
        if (!sender) return null

        const bdydata = ["cr", "cr.", "dr.", "dr", "credit", "debit", "rs.", "bank", "txn"]

        const otherBankWord = [
            'upi', 'pay', 'icici', 'axis', 'hdfc', 'sbi', 'kotak', 'indusind',
            'yesbank', 'citi', 'idfc', 'canara', 'paytm', 'phonepe', 'googlepay', 'bob', 'bobtxn', 'gpay'
        ]

        const bankKeywords = [...bdydata, ...otherBankWord]

        const senderLower = sender.toLowerCase()
        const bodyLower = body.toLowerCase()

        const isBankMsg = bankKeywords.some(keyword => senderLower.includes(keyword) || bodyLower.includes(keyword))

        if (!isBankMsg) return null

        let type: 'credit' | 'debit' | 'upi' | 'refund' | 'payment' | 'cr.' | 'cr' | 'dr' | 'dr.' = 'debit'

        if (/(credited|received|deposit|refund|refund|cr.|cr|credit)/i.test(body)) {
            type = 'credit'
        }
        if (/(debited|withdrawn|purchased|paid|payment|deducted|transferred|dr.|dr|debit)/i.test(body)) {
            type = 'debit'
        }
        if (/upi/i.test(body)) {
            type = 'upi'
        }
        if (/refund/i.test(body)) {
            type = 'refund'
        }
        if (/payment/i.test(body)) {
            type = 'payment'
        }

        const amountPatterns = [
            /(?:inr|rs\.?|₹)\s?([\d,]+(?:\.\d+)?)/i,
            /([\d,]+(?:\.\d+)?)\s?(?:inr|rs|₹)/i,
            /amount\s?[:\-]?\s?([\d,]+(?:\.\d+)?)/i,
        ]

        let amount: number | null = null

        for (const pattern of amountPatterns) {
            const match = body.match(pattern)
            if (match && match[1]) {
                amount = parseFloat(match[1].replace(/,/g, ''))
                break
            }
        }

        if (!amount) return null

        const dateMatch = body.match(
            /(?:on|dt|due on|dated|date|transacted on|txn date|transaction date)\s*[:\-]?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/i
        )
        const date = dateMatch
            ? new Date(dateMatch[1]).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10)

        const descMatch = body.match(/(?:to|at|for|via|with|from|on behalf of)\s+([\w\s&.-]{3,50})/i)
        const description = descMatch ? descMatch[1].trim() : body.slice(0, 100)

        return {
            amount,
            type,
            date,
            bank: sender,
            description,
        }

    } catch (error) {
        console.log("parseSMS error -------- ", error)
        return null
    }
}