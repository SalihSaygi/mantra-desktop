export interface LocalStorage {
  notes?: Note[]
  editor?: Editor[]
  categories?: Category[]
  options?: LocalStorageOptions;
  blockedURL?: blockedURL[];

}

export interface blockedURL {
  id: string,
  blockedLinks: string[],
  exceptionLinks: string[],
  categories: string[],
}

export interface Category {
  title: string;
  links?: String[];
}

export interface Note {
  id: string,
  title: string;
  content: string;
  category: String[] | string; 
}

export interface Block {
  type: string,
  data: {
    text: string,
    level: number
  }
}

export interface Editor {
  id: string | undefined,
  blocks: Array<Block>,
  time?: any;
}

export interface LocalStorageOptions {
  isDarkMode?: boolean
}

export type LocalStorageKeys = keyof LocalStorage

// export function getStoredNotes(): Promise<Note[]> {
//   const keys: LocalStorageKeys[] = ['notes']
//   return new Promise((resolve) => {
//     chrome.storage.local.get(keys, (res: LocalStorage) => {
//       resolve(res.notes)
//     })
//   })
// }

// export function setStoredNotes(notes: Note[]): Promise<void> {
//   const vals: LocalStorage = {
//     notes: notes,
//   }
//   console.log(vals, "yo")
//   return new Promise((resolve) => {
//     chrome.storage.local.set({"notes": notes}, () => {
//         console.log(vals, "yo2")

//       resolve()
//     })
//   })
// }

// export function getStoredEditor(): Promise<Editor[]> {
//   const keys: LocalStorageKeys[] = ['editor']
//   return new Promise((resolve) => {
//     chrome.storage.local.get(keys, (res: LocalStorage) => {
//       console.log(res, "resEditor")
//       resolve(res.editor)
//     })
//   })
// }

// export function setStoredEditor(editor: Editor[]): Promise<void> {
//   const vals: LocalStorage = {
//     editor: editor,
//   }
//     console.log(vals, "yo")

//   return new Promise((resolve) => {
//     chrome.storage.local.set({"editor": editor}, () => {
//         console.log(vals, "yo2")

//       resolve()
//     })
//   })
// }

// export function getStoredCategories(): Promise<Category[]> {
//     const keys: LocalStorageKeys[] = ['categories']
//   return new Promise((resolve) => {
//     chrome.storage.local.get(keys, (res: LocalStorage) => {
//       console.log(res, "resCategories")
//       resolve(res.categories ?? [])
//     })
//   })
// }

// export function setStoredCategories(categories: Category[]): Promise<void> {
//   const vals: LocalStorage = {
//     categories: categories,
//   }
//     console.log(vals, "yo")

//   return new Promise((resolve) => {
//     chrome.storage.local.set({"categories": categories}, () => {
//         console.log(vals, "yo2")

//       resolve()
//     })
//   })
// }

// export function getStoredURL(): Promise<blockedURL[]> {
//   const keys: LocalStorageKeys[] = ['blockedURL']
//   return new Promise((resolve) => {
//     chrome.storage.local.get(keys, (res: LocalStorage) => {
//       resolve(res.blockedURL)
//     })
//   })
// }

// export function setStoredURL(blockedURL: blockedURL[]): Promise<void> {
//   const vals: LocalStorage = {
//     blockedURL: blockedURL,
//   }
//     console.log(vals, "yo")

//   return new Promise((resolve) => {
//     chrome.storage.local.set({"blockedURL": blockedURL}, () => {
//         console.log(vals, "yo2")

//       resolve()
//     })
//   })
// }

// export function getStoredOptions(): Promise<LocalStorageOptions> {
//   const keys: LocalStorageKeys[] = ['options']
//   return new Promise((resolve) => {
//     chrome.storage.local.get(keys, (res: LocalStorage) => {
//       resolve(res.options)
//     })
//   })
// }

// export function setStoredOptions(options: LocalStorageOptions): Promise<void> {
//   const vals: LocalStorage = {
//     options: options,
//   }
//     console.log(vals, "yo")

//   return new Promise((resolve) => {
//     chrome.storage.local.set({"options": options}, () => {
//         console.log(vals, "yo2")

//       resolve()
//     })
//   })
// }