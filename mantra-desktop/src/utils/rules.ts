import { BaseDirectory } from "@tauri-apps/api/fs"
import { writeTextFile } from "@tauri-apps/api/fs"
import { nanoid } from "nanoid"

    enum RuleActionType {
        BLOCK = "block",
        REDIRECT = "redirect",
        ALLOW = "allow",
        UPGRADE_SCHEME = "upgradeScheme",
        MODIFY_HEADERS = "modifyHeaders",
        ALLOW_ALL_REQUESTS = "allowAllRequests"
    }
    
   enum ResourceType {
        MAIN_FRAME = "main_frame",
        SUB_FRAME = "sub_frame",
        STYLESHEET = "stylesheet",
        SCRIPT = "script",
        IMAGE = "image",
        FONT = "font",
        OBJECT = "object",
        XMLHTTPREQUEST = "xmlhttprequest",
        PING = "ping",
        CSP_REPORT = "csp_report",
        MEDIA = "media",
        WEBSOCKET = "websocket",
        OTHER = "other"
    }
    
    // const addBlockRule = (dirtyURL, resource) => {
//   return new Promise<void>((res, rej) => {
//     if(isNaN(dirtyURL) || isNaN(resource)) {
//       rej("Needed parameters are missing.")
//     }
//     const url = urlSanitizer(dirtyURL)

//     let id = nanoid()

//     chrome.declarativeNetRequest.updateDynamicRules(
//       {addRules:[{
//         "id": id,
//         "priority": 2,
//         "action": { "type": "block" },
//         "condition": {"urlFilter": url, "resourceTypes": resource || ["main_frame"] }}
//       ],
//         removeRuleIds: [id]
//       })
//     res()
//   })
// }

const addRedirectRule = (dirtyURL, categories) => {
  return new Promise<void>((res, rej) => {
    const query = getCategoryQuery(categories)
    let content = `http://127.0.0.1:1420/#/notes/${query} ${dirtyURL}`
    writeTextFile('Windows/System32/drivers/etc/hosts.file', content, { dir: BaseDirectory.Executable }).then(() => {
      res()
    })
  })
}

// const addExceptionRule = (dirtyURL) => {
//   const url = urlSanitizer(dirtyURL)

//   let id = nanoid()

//   chrome.declarativeNetRequest.updateDynamicRules(
//     {addRules:[{
//       "id": Number(id),
//       "priority": 1,
//       "action": { "type": RuleActionType.BLOCK},
//       "condition": {"urlFilter": url, "resourceTypes": [ResourceType.MAIN_FRAME] }}
//     ],
//       removeRuleIds: [Number(id)]
//     })
// }

// const addRedirectExceptionRule = (dirtyURL, categories) => {
//   const url = urlSanitizer(dirtyURL)
//   let id = nanoid()

//   const extensionURL = browser.runtime.getURL(getCategoryQuery(categories))

//   chrome.declarativeNetRequest.updateDynamicRules(
//     {addRules:[{
//       "id": id,
//       "priority": 1,
//       "action": { "type": "redirect", redirect: { "url": extensionURL }},
//       "condition": {"urlFilter": url, "resourceTypes": ["main_frame"] }}
//     ],
//       removeRuleIds: [id]
//     })
// }

const urlSanitizer = (dirtyURL) => {
  return dirtyURL.replace("[^-A-Za-z0-9+&@#/%?=~_|!:,.;\(\)]", "");
} 

const getCategoryQuery = (categories) => {
  console.log(categories, "categories")
  let query = `#/notes?category=${categories[0]}`
  categories.shift()
  categories.forEach(category => {
   query.concat(`&category=${category}`)
  })
  return query
}

export { addRedirectRule }