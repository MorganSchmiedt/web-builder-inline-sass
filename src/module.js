'use strict'
/* eslint-env node, es6 */

const sass = require('node-sass')

const TAG_NAME = 'inlineSASS'

/**
 * @param {Map} fileMap List of files with their content
 * @param {object} opt Module options
 * @param {Array<String>} assets List of directories that include the images
 * @param {object} parserOptions Parser options
 * @param {object} lib Engine library
 * @param {function} lib.log
 * @param {function} lib.findAsset
 * @param {function} lib.getTag
 * @param {function} lib.getTagList
 */
module.exports = async(fileMap, opt, lib) => {
  const assets = opt.assets
  const { findAsset, getTag, getTagList, log } = lib

  if (assets == null) {
    log('No assets provided.')
    return
  }

  // Read file tags
  const depsPerFile = new Map()

  for (const [path, content] of fileMap.entries()) {
    const depList = getTagList(TAG_NAME, content)

    depsPerFile.set(path, depList)
  }

  // Initialize a unique list of dependencies
  const depMap = new Map()

  for (const depList of depsPerFile.values()) {
    for (const depPath of depList) {
      if (depMap.has(depPath) === false) {
        depMap.set(depPath, null)
      }
    }
  }

  // Fetch dependencies content
  await Promise.all(Array.from(depMap.keys())
    .map(async name => {
      const path = await findAsset(name, assets)

      if (path == null) {
        throw `Dependency not found: ${path}`
      }

      const sassOptions = Object.assign({}, opt.sassOptions, {
        file: path,
      })

      if (opt.minify === true
      && opt.sassOptions == null) {
        sassOptions.outputStyle = 'compressed'
      }

      const content = await new Promise((resolve, reject) =>
        sass.render(sassOptions, (err, result) => {
          if (err) {
            reject(err)
            return
          }

          resolve(result.css.toString())
        }))

      depMap.set(name, content)
    }))

  // Replace assets
  for (const [path, tagList] of depsPerFile.entries()) {
    if (tagList.length > 0) {
      let content = fileMap.get(path)

      for (const tag of tagList) {
        const tagName = getTag(TAG_NAME, tag)
        const depValue = depMap.get(tag)
        const value = `<style>${depValue}</style>`

        content = content.replace(new RegExp(tagName, 'g'), value)

        log(`InlineSASS: ${tag} in ${path}`)
      }

      fileMap.set(path, content)
    }
  }
}
