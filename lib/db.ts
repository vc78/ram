import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

function tablePath(table: string) {
    return path.join(dataDir, `${table}.json`)
}

function ensureTable(table: string) {
    const file = tablePath(table)
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "[]")
    }
}

export function loadTable(table: string): any[] {
    ensureTable(table)
    try {
        const raw = fs.readFileSync(tablePath(table), "utf-8")
        return JSON.parse(raw || "[]")
    } catch (err) {
        console.error(`Failed to read table ${table}`, err)
        return []
    }
}

export function saveTable(table: string, data: any[]) {
    try {
        fs.writeFileSync(tablePath(table), JSON.stringify(data, null, 2))
    } catch (err) {
        console.error(`Failed to write table ${table}`, err)
    }
}

export function getAll(table: string) {
    return loadTable(table)
}

export function insert(table: string, item: any) {
    const arr = loadTable(table)
    arr.push(item)
    saveTable(table, arr)
    return item
}

export function deleteWhere(table: string, predicate: (row: any) => boolean) {
    const arr = loadTable(table)
    const filtered = arr.filter((r) => !predicate(r))
    saveTable(table, filtered)
    return filtered
}

export function updateWhere(table: string, predicate: (row: any) => boolean, updater: (row: any) => any) {
    const arr = loadTable(table)
    let changed = false
    const updated = arr.map((r) => {
        if (predicate(r)) {
            changed = true
            return updater(r)
        }
        return r
    })
    if (changed) saveTable(table, updated)
    return updated
}
