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
async function handlePostRequests(data: PostDataParams) {
  await createSheetIfMissing(getSheetName())
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
        process.env.GSHEET_ID,
        getSheetName(),
      )
      return true
    default:
      return false
  }
}

async function handleGetRequests(data: GetDataParams) {
  await createSheetIfMissing(getSheetName())
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
        process.env.GSHEET_ID,
        getSheetName(),
      )
      return rows[0]
    default:
  }
}

// -- Abstracted Logics
async function getAreas() {
  var rows = await getData(
    `A${AREAS_START}:A`,
    process.env.GSHEET_ID,
    getSheetName(),
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
    process.env.GSHEET_ID,
    getSheetName(),
  )
  rows = rows.filter((row) => row[0] != null && row[0] != '')
  return rows[0]
}

async function createSheetIfMissing(sheetName: string) {
  var sheets = await getSheetNames(process.env.GSHEET_ID)
  if (!sheets.includes(sheetName)) {
    await duplicateSheet(
      process.env.GSHEET_ID,
      Number(process.env.TEMPLATE_SHEET_ID),
      sheetName,
    )
  }
}

// -- Abstracted Utils
function getSheetName() {
  const todayDate = new Date()
  const todayMonth = todayDate.toLocaleString('default', { month: 'short' })
  const todayYear = todayDate.getFullYear()
  const todaySession = todayDate.getDate() <= 17 ? 1 : 2
  return `${todayMonth} ${todayYear} [${todaySession}]`
}
