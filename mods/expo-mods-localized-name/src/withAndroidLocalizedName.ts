import { AndroidConfig, ConfigPlugin, withStringsXml } from "expo/config-plugins"
import fs from "fs"
import path from "path"
import xml2js from "xml2js"

const builder = new xml2js.Builder({ headless: true })

export const withAndroidLocalizedName: ConfigPlugin = config => {
  return withStringsXml(config, async config => {
    const resPath = await AndroidConfig.Paths.getResourceFolderAsync(config.modRequest.projectRoot)

    for (const locale of Object.keys(config.locales ?? {})) {
      const localePath = config.locales?.[locale] as string
      console.log(`found locales(${locale}): ${localePath}`)

      const json = await fs.promises.readFile(localePath)
      const strings = JSON.parse(json.toString())

      const resources = []
      for (const key of Object.keys(strings)) {
        // Skip values that are not marked for translation or simply do not exist
        // because gradle does not like them
        const untranslated = config.modResults.resources.string?.find(
          item => item.$.name === key && `${item.$.translatable}` !== "false"
        )
        if (untranslated) {
          resources.push({ string: { $: { name: key }, _: strings[key] } })
        }
      }
      if (resources.length) {
        await fs.promises.mkdir(path.resolve(resPath, `values-${locale}`), { recursive: true })
        await fs.promises.writeFile(
          path.resolve(resPath, `values-${locale}`, "strings.xml"),
          builder.buildObject({ resources })
        )
      }
    }
    return config
  })
}
