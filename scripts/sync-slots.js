import puppeteer from 'puppeteer-core'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let val = match[2] || ''
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
        process.env[key] = val.trim()
      }
    }
  }
}
loadEnv()

const URL = 'https://www.kenketsu.jp/reservationeditbydate?birthday=20&birthmonth=9&birthyear=2000&day=15&from=date&month=9&placeId=a0p0K000007osDqQAI&sex=%E7%94%B7%E6%80%A7&year=2026'

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
]

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kdtsvsfswywfhtlegvfg.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const SLOT_MAPPING = {
  '09:45': '09:45-10:00',
  '10:00': '10:00-10:30',
  '10:30': '10:30-11:00',
  '11:00': '11:00-11:30',
  '13:00': '13:00-13:30',
  '13:30': '13:30-14:00',
  '14:00': '14:00-14:30',
  '14:30': '14:30-15:00',
  '15:00': '15:00-15:30',
  '15:30': '15:30-16:00',
  '16:00': '16:00-16:30'
}

export async function syncRedCrossCapacities(eventYear = 2026) {
  let executablePath = ''
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) {
      executablePath = p
      break
    }
  }

  if (!executablePath) {
    throw new Error('No compatible Chromium browser found.')
  }

  console.log(`[Scraper] Launching browser: ${executablePath}`)
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    console.log(`[Scraper] Navigating to Red Cross reservation page...`)
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 40000 })

    const rawSlots = await page.evaluate(() => {
      const slotMap = {}
      const allElements = Array.from(document.querySelectorAll('*'))
      const timePattern = /^(\d{2}:\d{2})$/

      for (const el of allElements) {
        const txt = el.textContent ? el.textContent.trim() : ''
        if (timePattern.test(txt) && el.children.length === 0) {
          const parent = el.parentElement
          if (parent) {
            const parts = parent.innerText.split(/\s+/).filter(Boolean)
            const timeIdx = parts.indexOf(txt)
            if (timeIdx !== -1 && parts[timeIdx + 1] !== undefined) {
              const count = parseInt(parts[timeIdx + 1], 10)
              if (!isNaN(count) && count >= 0 && count <= 50) {
                slotMap[txt] = count
              }
            }
          }
        }
      }
      return slotMap
    })

    console.log('[Scraper] Raw slots found:', rawSlots)

    const rows = []
    for (const [startTime, fullSlot] of Object.entries(SLOT_MAPPING)) {
      if (rawSlots[startTime] !== undefined) {
        rows.push({
          event_year: eventYear,
          time_slot: fullSlot,
          remaining: rawSlots[startTime],
          updated_at: new Date().toISOString()
        })
      }
    }

    if (rows.length === 0) {
      throw new Error('No valid time slots extracted from page.')
    }

    console.log(`[Scraper] Updating ${rows.length} slots in Supabase...`)
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const { error } = await supabase
      .from('official_slot_capacities')
      .upsert(rows, { onConflict: 'event_year,time_slot' })

    if (error) {
      throw error
    }

    console.log('[Scraper] Successfully synced with Supabase!')
    return rows
  } finally {
    await browser.close()
  }
}

if (process.argv[1]?.endsWith('sync-slots.js')) {
  syncRedCrossCapacities()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Scraper Error]:', err)
      process.exit(1)
    })
}
