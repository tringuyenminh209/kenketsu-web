import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from "exceljs"
import type { SheetData } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HEADER_FILL = "FFCE0017" // brand red
const HEADER_FONT = "FFFFFFFF" // white

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
      data.headers[i]?.length ?? 10,
      ...data.rows.map((r) => String(r[i] ?? "").length),
    )
    col.width = Math.min(Math.max(longest * 1.3, 12), 40)
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
