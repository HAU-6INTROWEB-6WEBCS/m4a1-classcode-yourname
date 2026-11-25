// Adapted from the course engine's INTROWEB m1a1 Vitest/jsdom checks.
// See NOTICE for source attribution and license information.
import { describe, expect, it } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { JSDOM } from "jsdom"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src")
const identity = JSON.parse(readFileSync(new URL("../student.json", import.meta.url), "utf8"))
const PAGES = ["index.html", "pages/about.html", "pages/contact.html"]
const load = (file) => {
  const path = resolve(root, file)
  return existsSync(path) ? new JSDOM(readFileSync(path, "utf8")).window.document : null
}
const docs = Object.fromEntries(PAGES.map((p) => [p, load(p)]))
const isExternal = (href) => /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href)
const links = (doc) => [...(doc?.querySelectorAll("a[href]") ?? [])]
const fileOf = (page, href) => resolve(root, dirname(page), href.split("#")[0].split("?")[0])

describe("M4A1: Mini Site Navigation", () => {
  it("has all three pages in the right folders", () => {
    for (const p of PAGES) {
      expect(existsSync(resolve(root, p)), `Create src/${p}.`).toBe(true)
    }
  })

  it("starts every page with the HTML5 skeleton and a title", () => {
    for (const p of PAGES) {
      const d = docs[p]
      expect(d?.doctype?.name.toLowerCase(), `${p}: start with <!DOCTYPE html>.`).toBe("html")
      expect(d?.documentElement.getAttribute("lang"), `${p}: set lang="en".`).toBe("en")
      expect(d?.querySelector("head meta[charset]")?.getAttribute("charset")?.toLowerCase(), `${p}: declare UTF-8.`).toBe("utf-8")
      expect(d?.title.trim().length ?? 0, `${p}: give it a title.`).toBeGreaterThan(3)
      expect(d?.querySelectorAll("h1").length ?? 0, `${p}: use exactly one h1.`).toBe(1)
    }
  })

  it("puts the same navigation, with links to all three pages, on every page", () => {
    for (const p of PAGES) {
      const nav = docs[p]?.querySelector("nav")
      expect(nav, `${p}: wrap the navigation in a nav element.`).not.toBeNull()
      const targets = [...(nav?.querySelectorAll("a[href]") ?? [])].map((a) => fileOf(p, a.getAttribute("href")))
      for (const want of PAGES) {
        expect(targets, `${p}: the navigation must link to ${want}.`).toContain(resolve(root, want))
      }
    }
  })

  it("makes every relative link reach a real file", () => {
    const internal = PAGES.flatMap((p) => links(docs[p]).filter((a) => !isExternal(a.getAttribute("href")) && !a.getAttribute("href").startsWith("#")))
    expect(internal.length, "Link the pages to each other with relative paths.").toBeGreaterThanOrEqual(6)
    for (const p of PAGES) {
      for (const a of links(docs[p])) {
        const href = a.getAttribute("href")
        if (isExternal(href) || href.startsWith("#")) continue
        expect(existsSync(fileOf(p, href)), `${p}: the link "${href}" points at a file that does not exist. Check the ../ steps.`).toBe(true)
      }
    }
  })

  it("lets the pages in the pages folder reach the home page with ../", () => {
    for (const p of ["pages/about.html", "pages/contact.html"]) {
      const hrefs = links(docs[p]).map((a) => a.getAttribute("href"))
      expect(hrefs.some((h) => /^\.\.\/index\.html/.test(h)), `${p}: link back to the home page with ../index.html.`).toBe(true)
    }
  })

  it("has a back-to-top link whose target exists on the home page", () => {
    const d = docs["index.html"]
    const hrefs = links(d).map((a) => a.getAttribute("href")).filter((h) => h.startsWith("#") && h.length > 1)
    expect(hrefs.length, "Add a link that jumps to a place in the same page, such as a back-to-top link.").toBeGreaterThan(0)
    for (const h of hrefs) {
      expect(d.getElementById(h.slice(1)), `The link "${h}" needs an element with that id.`).not.toBeNull()
    }
  })

  it("links out to another site safely", () => {
    const external = links(docs["index.html"]).filter((a) => /^https:\/\//.test(a.getAttribute("href")))
    expect(external.length, "Add one link to another website, starting with https://.").toBeGreaterThan(0)
    for (const a of external.filter((x) => x.getAttribute("target") === "_blank")) {
      expect(a.getAttribute("rel") ?? "", "A link that opens a new tab needs rel=\"noopener noreferrer\".").toMatch(/noopener/)
    }
  })

  it("writes link text that says where the link goes", () => {
    expect(links(docs["index.html"]).length, "The home page needs links.").toBeGreaterThan(0)
    for (const p of PAGES) {
      for (const a of links(docs[p])) {
        expect(a.textContent.trim().toLowerCase(), `${p}: link text such as "click here" tells the reader nothing.`).not.toMatch(/^(click here|here|link|read more)$/)
        expect(a.textContent.trim().length, `${p}: a link needs visible text.`).toBeGreaterThan(0)
      }
    }
  })
})

describe("Student identity in your private copy", () => {
  it("contains the required details as non-empty text", () => {
    for (const field of ["fullName", "studentNumber", "studentEmail", "classCode", "githubAccount", "room", "pcNumber"]) {
      expect(typeof identity[field], `Keep ${field} as text.`).toBe("string")
      expect(identity[field]?.trim(), `Fill in ${field} in student.json.`).toBeTruthy()
    }
  })

  it("uses class code 2006", () => {
    expect(identity.classCode).toBe("2006")
  })
})
