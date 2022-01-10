import { TeleMessage, TeleUpdate } from './lib/tele-types'
import { sendMessage } from './lib/telegram-interface'

export async function handler(
  event: { httpMethod: string; body: string },
  context: any,
) {
  if (event.httpMethod == 'POST') {
    const prompt = JSON.parse(event.body)
    await processTelePrompt(prompt)
  }
  return {
    statusCode: 200,
    body: 'done',
  }
}

async function processTelePrompt(prompt: TeleUpdate) {
  let err = new Error('Unknown error thrown')
  try {
    if (prompt.message) await processTeleMsg(prompt.message)
  } catch (e) {
    if (e instanceof Error) {
      err = e
    }
    await processTeleError(prompt, err)
    console.log(e)
  }
}

export async function processTeleMsg(message: TeleMessage) {
  if (!message.text && message.new_chat_members[0].id == 5076890184) {
    await sendMessage(
      process.env.TELEBOT_KEY,
      message.chat.id,
      `This group's chat id is: <b>${message.chat.id}</b>`,
    )
  }
}

export async function processTeleError(prompt: TeleUpdate, errorMsg: Error) {
  await sendMessage(
    process.env.TELEBOT_KEY,
    process.env.DEV_ID,
    `<b>Error encountered</b>:`,
  )
  await sendMessage(
    process.env.TELEBOT_KEY,
    process.env.DEV_ID,
    JSON.stringify(prompt),
  )
  await sendMessage(
    process.env.TELEBOT_KEY,
    process.env.DEV_ID,
    `${errorMsg.message}`,
  )
}
