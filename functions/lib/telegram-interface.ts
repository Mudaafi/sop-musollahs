import axios from 'axios'
import {
  convertError,
  TeleInlineKeyboard,
  TeleInlineKeyboardButton,
  TeleReplyKeyboard,
} from './tele-types'

const TELE_API = 'https://api.telegram.org/bot'

/**
 * Sends a message via the bot
 * @param bot_key
 * @param chat_id
 * @param text
 * @param reply_markup
 * @returns
 */
export async function sendMessage(
  bot_key: string,
  chat_id: number | string,
  text: string,
  reply_markup:
    | TeleInlineKeyboard
    | TeleReplyKeyboard = {} as TeleInlineKeyboard,
) {
  return new Promise((resolve, reject) => {
    axios
      .post(TELE_API + bot_key + '/sendMessage', {
        chat_id: chat_id,
        text: text,
        parse_mode: 'HTML',
        reply_markup: reply_markup,
      })
      .then((res) => {
        const msgDetails = res.data.result
        console.log(`Message posted (id: ${msgDetails.message_id})`)
        resolve(res.data)
      })
      .catch((err) => {
        reject(convertError(err))
      })
  })
}

/**
 * Generates the Telegram parameter for Inline Keyboard Markup
 * @param buttonArr array of rows containing an array of button labels (rows, cols)
 * @param callbackArr single array of callback data matching buttonArr (for each row, for each col)
 * @returns  Parameter Object for posting Inline (callback_query) Buttons
 */
export function genInlineButtons(
  buttonArr: Array<Array<string>>,
  callbackArr: Array<string>,
) {
  var result = []
  var counter = 0
  for (var i = 0; i < buttonArr.length; ++i) {
    var rowArr = []
    for (var buttonLabel of buttonArr[i]) {
      rowArr.push({
        text: buttonLabel,
        callback_data: callbackArr[counter],
      } as TeleInlineKeyboardButton)
      counter += 1
    }
    result.push(rowArr)
  }
  return { inline_keyboard: result } as TeleInlineKeyboard
}
