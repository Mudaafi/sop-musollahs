import { TeleApiParams } from './lib/types'
import { sendMessage as sendTeleMsg } from './lib/telegram-interface'

// --- Http Handlers
const headers = {
  /* Required for CORS support to work */
  // Not required for deployment
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function handler(event, context) {
  var httpMethod = event.httpMethod
  let res: any = 'Api Call Complete'
  switch (httpMethod) {
    case 'POST':
      const body: TeleApiParams = JSON.parse(event.body)
      let response = await sendTeleMsg(
        process.env.TELEBOT_KEY,
        body.groupId,
        body.message,
      )
      res = response != undefined ? response.toString() : res
      break

    case 'GET':
      res = 'No Get Function Defined'
      break
    default:
  }
  return {
    statusCode: 200,
    headers,
    body: res,
  }
}
