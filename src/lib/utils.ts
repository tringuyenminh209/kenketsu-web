import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from "exceljs"
import type { SheetData } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HEADER_FILL = "FFCE0017" // brand red
const HEADER_FONT = "FFFFFFFF" // white

// 全角文字（日本語など）は半角の約2倍の幅で表示されるため、
// .lengthではなく実際の表示幅で列幅を計算する
function displayWidth(text: string): number {
  let width = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    const isFullWidth =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x20000 && code <= 0x3ffff)
    width += isFullWidth ? 2 : 1
  }
  return width
}

export async function downloadXLSX(data: SheetData, filename: string, sheetName: string) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet(sheetName)

  sheet.addRow(data.headers)
  data.rows.forEach((row) => sheet.addRow(row))

  const headerRow = sheet.getRow(1)
  headerRow.height = 22
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: HEADER_FONT } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } }
    cell.alignment = { vertical: "middle", horizontal: "center" }
  })

  sheet.columns.forEach((col, i) => {
    const longest = Math.max(
      displayWidth(data.headers[i] ?? ""),
      ...data.rows.map((r) => displayWidth(String(r[i] ?? ""))),
    )
    col.width = Math.max(longest + 4, 12)
  })

  sheet.views = [{ state: "frozen", ySplit: 1 }]
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: data.headers.length } }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
