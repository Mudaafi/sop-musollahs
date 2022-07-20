import {
  getData,
  writeData,
  getSheetNames,
  duplicateSheet,
} from './lib/gsheet-interface'
import { GoogleApisParams, GetDataParams, PostDataParams } from './lib/types'

// --- Http Handlers
const headers = {
  /* Required for CORS support to work */
  // Not required for deployment
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type',
}

const GSHEET_ID = process.env.GSHEET_ID || ''

export async function handler(event, context) {
  var httpMethod = event.httpMethod
  let res: any = 'Api Call Complete'
  switch (httpMethod) {
    case 'POST':
      const body: GoogleApisParams = JSON.parse(event.body)
      const response = await handlePostRequests(body as PostDataParams)
      res = response != undefined ? response.toString() : res
      break

    case 'GET':
      const params: GoogleApisParams = event.queryStringParameters
      res = JSON.stringify(await handleGetRequests(params as GetDataParams))
      break
    default:
  }
  return {
    statusCode: 200,
    headers,
    body: res,
  }
}

const AREAS_START = 3
const FIELDS_START = 'B'
const FIELDS_ROW = 2
const CONFIG_SHEET = 'Config'
const PAST_SHEET_DATA_RANGE = 'D3:F3'
const NEW_SHEET_DATE_CELL = 'D3'
const NEW_SHEET_COUNTER_CELL = 'E3'

async function handlePostRequests(data: PostDataParams) {
  switch (data.function) {
    case 'update':
      var rowNo = await getAreaRow(data.area)
      if (rowNo == -1) return 'Incorrect Area Parameter'
      var fields = await getFields()
      var colNum = fields.indexOf(data.field)
      if (colNum == -1) return 'Incorrect Field Parameter'

      await writeData(
        `${String.fromCharCode(colNum + 2 + 64)}${rowNo + AREAS_START}`,
        data.data,
        GSHEET_ID,
        await getCurrentSheetName(),
      )
      return true
    default:
      return false
  }
}

async function handleGetRequests(data: GetDataParams) {
  await createSheetIfRequired()
  switch (data.function) {
    case 'fields':
      return getFields()
    case 'areas':
      return getAreas()
    case 'values':
      if (!data.area) return 'Missing Area Parameter'
      var rowNo = await getAreaRow(data.area)
      if (rowNo == -1) return 'Incorrect Area Parameter'

      var rows = await getData(
        `${FIELDS_START}${rowNo + AREAS_START}:${rowNo + AREAS_START}`,
        GSHEET_ID,
        await getCurrentSheetName(),
      )
      return rows[0]
    case 'telegroup':
      var rows = await getData('A3:B', GSHEET_ID, CONFIG_SHEET)
      var groupId = rows.filter((row) => row[0] == data.area)[0][1]
      return groupId
    case 'generate':
      await getCurrentSheetName()
      return 'generated'
    default:
      return 'default get request reached'
  }
}

// -- Abstracted Logics
async function getAreas() {
  var rows = await getData(
    `A${AREAS_START}:A`,
    GSHEET_ID,
    await getCurrentSheetName(),
  )
  rows = rows.filter((row) => row[0] != null && row[0] != '')
  var areas = rows.map((row: Array<String>) => row[0])
  return areas
}

async function getAreaRow(area: string) {
  var areas = await getAreas()
  var rowNo = areas.indexOf(area)
  return rowNo
}

async function getFields() {
  var rows = await getData(
    `${FIELDS_START}${FIELDS_ROW}:${FIELDS_ROW}`,
    GSHEET_ID,
    await getCurrentSheetName(),
  )
  rows = rows.filter((row) => row[0] != null && row[0] != '')
  return rows[0]
}

async function createSheetIfRequired() {
  let pastSheetData = (
    await getData(PAST_SHEET_DATA_RANGE, GSHEET_ID, CONFIG_SHEET)
  )[0]
  let todayDate = new Date()
  let lastCreatedDate = new Date(pastSheetData[0])
  var dayInterval = Number(pastSheetData[2])
  if (
    pastSheetData[0] == '' ||
    todayDate.getDate() - lastCreatedDate.getDate() >= dayInterval
  ) {
    await generateNewSheet()
    return true
  }
  return false
}

async function generateNewSheet() {
  const todayDate = new Date()
  let pastSheetData = (
    await getData(PAST_SHEET_DATA_RANGE, GSHEET_ID, CONFIG_SHEET)
  )[0]
  let lastCreatedDate = new Date(pastSheetData[0])
  var counter = Number(pastSheetData[1])
  if (lastCreatedDate.getMonth() == todayDate.getMonth()) {
    counter += 1
  } else {
    counter = 1
  }

  await duplicateSheet(
    GSHEET_ID,
    Number(process.env.TEMPLATE_SHEET_ID),
    `${genSheetName()} [${counter}]`,
  )
  await updateNewSheetGeneratedDate()
  await updateNewSheetCounter(counter)
}

async function updateNewSheetGeneratedDate() {
  const todayDate = new Date()
  await writeData(
    NEW_SHEET_DATE_CELL,
    todayDate.toString(),
    GSHEET_ID,
    CONFIG_SHEET,
  )
}

async function updateNewSheetCounter(counter: number) {
  await writeData(
    NEW_SHEET_COUNTER_CELL,
    counter.toString(),
    GSHEET_ID,
    CONFIG_SHEET,
  )
}

// -- Abstracted Utils
function genSheetName() {
  const todayDate = new Date()
  const todayMonth = todayDate.toLocaleString('default', { month: 'short' })
  const todayYear = todayDate.getFullYear()
  return `${todayMonth} ${todayYear}`
}

async function getCurrentSheetName() {
  let sheetNames = await getSheetNames(GSHEET_ID)
  return sheetNames[0]
}
