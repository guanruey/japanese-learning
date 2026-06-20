import kuromoji from 'kuromoji'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import path from 'node:path'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)
const dicPath = path.join(process.cwd(), 'node_modules/kuromoji/dict')

const tokenizer = await new Promise((resolve, reject) => {
  kuromoji.builder({ dicPath }).build((err, tk) => (err ? reject(err) : resolve(tk)))
})

const kataToHira = (input = '') =>
  input.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60)).replace(/ヴ/g, 'ゔ')

const normalizeJapanese = (input = '') =>
  input
    .replaceAll('來', '来')
    .replaceAll('出來', 'でき')
    .replaceAll('騒ない', '騒がない')

const toReading = (input = '') =>
  tokenizer
    .tokenize(normalizeJapanese(input))
    .map((token) => (token.reading && token.reading !== '*' ? kataToHira(token.reading) : token.surface_form))
    .join('')

const escapeSql = (input = '') => input.replaceAll("'", "''")

const grammarRes = await supabase.from('grammar').select('id,pattern,reading,example_ja,example_reading').order('id')
const vocabRes = await supabase.from('vocabulary').select('id,kanji,reading,example_ja,example_reading').order('id')

if (grammarRes.error) throw grammarRes.error
if (vocabRes.error) throw vocabRes.error

const grammarMap = {}
const vocabularyMap = {}
let sql = '-- Auto-generated reading seed for grammar and vocabulary\n-- Safe to re-run.\n\n'

for (const row of grammarRes.data || []) {
  const merged = {
    reading: row.reading || toReading(row.pattern || ''),
    example_reading: row.example_reading || toReading(row.example_ja || ''),
  }
  grammarMap[row.id] = merged
  sql += `update public.grammar set reading = '${escapeSql(merged.reading)}', example_reading = '${escapeSql(
    merged.example_reading
  )}' where id = '${escapeSql(row.id)}';\n`
}

sql += '\n'

for (const row of vocabRes.data || []) {
  const merged = {
    example_reading: row.example_reading || toReading(row.example_ja || ''),
  }
  vocabularyMap[row.id] = merged
  sql += `update public.vocabulary set example_reading = '${escapeSql(merged.example_reading)}' where id = '${escapeSql(
    row.id
  )}';\n`
}

await fs.mkdir(path.join(process.cwd(), 'src/data'), { recursive: true })
await fs.writeFile(
  path.join(process.cwd(), 'src/data/generatedReadings.js'),
  `export const grammarReadings = ${JSON.stringify(grammarMap, null, 2)}\n\nexport const vocabularyReadings = ${JSON.stringify(
    vocabularyMap,
    null,
    2
  )}\n`
)
await fs.writeFile(path.join(process.cwd(), 'supabase/seed_generated_readings.sql'), sql)

console.log(`Generated ${Object.keys(grammarMap).length} grammar readings and ${Object.keys(vocabularyMap).length} vocabulary readings.`)
