# M4A1: Mini Site Navigation

**Kind:** in-lab demo. You follow along while the instructor builds it, then you push it. It is worth 5 points. Searching, AI and helping each other are allowed, because this is practice; record what you used in `SOURCES-AND-ASSISTANCE.md`.

This is week 4, links. The meeting builds a three-page site in folders, with the same navigation on every page, a back-to-top link and one link to another site. The tests click through your links for you, so a broken `../` fails.

## Before you start

Start the activity with the shared-lab launcher, exactly as in M1A0: follow the [setup guide](SETUP.md) to run the Mac launcher in Terminal or the Windows launcher in PowerShell, then clone your private repository `m4a1-CLASSCODE-USERNAME` in VS Code. Check that the repository name has your class code and your GitHub username before you continue.

```sh
npm ci
```

## What to build

Build this site inside the `src` folder, following the demo:

```text
src/
  index.html
  pages/
    about.html
    contact.html
```

- Every page has the HTML5 skeleton from M2 with `lang="en"`, a title of at least four characters and one `h1`.
- File and folder names must match the links exactly, capital letters included: a link to `about.html` does not reach `About.html` on the grading computer.
- Every page has the same `nav` with links to all three pages. A link from a page in `pages/` to the home page needs `../` to step out of the folder.
- The home page has a back-to-top link that jumps to an element in the same page with a matching `id`.
- The home page has one link to another website, starting with `https://`. If you open it in a new tab, add `rel="noopener noreferrer"`.
- Link text says where the link goes. "Read about us" is better than "click here".
- Both pages in `pages/` link back to the home page with `../index.html`.

## Concepts to follow in the demo

- Absolute and relative paths, and what `../` does.
- A link to a place in the same page: `href="#top"` and a matching `id`.
- Why a link to another site is different from a link inside your own.

## How it is graded

5 test points. The tests open every page, follow every relative link and fail when one points at a file that does not exist.

Every activity also checks `student.json`: fill in your full name, student number, school email, class code **2006**, GitHub username, `room` and `pcNumber`, all as text.

## Check and save your work

Click through your site in the browser, starting at the home page. Then run the checks:

```sh
npm test
```

The tests in your repository are a guide. The instructor grades from the course's own copy of the tests, so do not edit the tests to make them pass. In VS Code, open **Source Control**, commit your files with a short message, choose **Push**, and check that the commit appears on GitHub.

## Submit the exact commit link in Canvas

Open your repository's commit history on GitHub, open the commit with your finished work, copy its full URL (it contains **/commit/**), and submit it in the Canvas assignment for M4A1 using the Website URL option. Submit the commit page, not the repository home page or a screenshot.
