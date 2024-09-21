import { logger } from "alpalog";
import path from "path";
import { exit } from "process";
import { asyncExec, convertToCamelCase, getConfig, readJsonFile, writeJsonFile } from "./lib";

async function scan() {
  logger.info(`\n# Scanning all files for translations...`);

  const currentDir = process.cwd();
  const config = getConfig();

  logger.whisper('Loading default lang...')

  const langDirPathname = path.join(currentDir, config.langDir)
  const defaultLangPathname = path.join(
    langDirPathname,
    `${config.defaultLang}.json`
  )

  const defaultLang = readJsonFile<Record<string, string>>(defaultLangPathname)

  logger.whisper('Default lang loaded!')


  const pattern = `"\\bt\\([\\'](.*?)[\\']\\)"`

  let added = 0

  const scanFolder = (folder: string) => {
    logger.whisper(`Scanning ${folder}...`)

    const componentsDir = path.join(currentDir, folder)
    const command = `egrep -r ${pattern} ${componentsDir}`

    // Look for the pattern t('*') in all files in the target dir
    const stdout = asyncExec(command)

    const lines = stdout.split('\n')

    for (const line of lines) {
      const [file, text] = line.split(':')

      const match = text?.match(/t\('(.*?)\'\)/)

      if (!match) continue

      let key = match[1],
        content = ''

      if (key in defaultLang) {
        continue
      }

      added++

      if (key.includes('->')) {
        let [newKey, newContent] = key.split('->')

        if (newKey in defaultLang) {
          logger.error(`Key ${newKey} already exists and trying rewrite. Check ${newKey} in ${file}`)
          logger.whisper('Using previous value...')
          asyncExec(`sed -i 's/${key}/${newKey}/g' ${file}`)
          continue
        }

        // Detect if content has any characters beetween curly braces, like {user.name}
        const hasCurlyBraces = newContent.match(/{.*?}/)

        if (hasCurlyBraces) {
          const replacements = hasCurlyBraces.map(key => key.replace(/[{}]/g, ''))

          logger.whisper(replacements)

          let valuesObj = '{'

          replacements.forEach(replacement => {
            const key = convertToCamelCase(replacement)
            valuesObj += ` ${key}: ${replacement}, `
            newContent = newContent.replace(`{${replacement}}`, `{{${key}}}`)
          })

          valuesObj += '}'

          asyncExec(`sed -i "s/${key}')/${newKey}',${valuesObj})/g" ${file}`)
        } else {
          asyncExec(`sed -i 's/${key}/${newKey}/g' ${file}`)
        }

        key = newKey
        content = newContent
      }

      defaultLang[key] = content
    }
  }

  for (const folder of config.targetDir) {
    scanFolder(folder)
  }

  writeJsonFile(defaultLangPathname, defaultLang)

  logger.success(`\n✅ Added ${added} new keys to ${config.defaultLang}.json`)

  exit(0)
}

export default scan;