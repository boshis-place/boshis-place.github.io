#!/usr/bin/env node
import { readdir, writeFile } from "fs/promises"
import { extname, join } from "path"

// -- constants --
const k = {
  prefixLen: "00-00-00".length,
  eventsDir: join(".", "src", "_collections", "events"),
}

// -- main --
async function Main() {
  const dateSet = new Set(
    (await readdir(k.eventsDir))
      .filter((p) => extname(p) == ".md")
      .map((p) => p.slice(0, k.prefixLen)),
  )

  const writes = events.map((src) => {
    const dst = mapEvent(src)

    const datePrefix = toIsoDateString(dst.date).slice(2)
    if (dateSet.has(datePrefix)) {
      console.log(`- skip ${dst.name}`)
      return null
    }

    const lines = [
      `---`,
      `version: 1`,
      `name: "${dst.name}"`,
      `date: ${toIsoDateTimeString(dst.date)}`,
      `poster:`,
      `  src:`,
      `  alt:`,
      `links:`,
      `  ${toLink(dst, "tickets")}`,
      `  ${toLink(dst, "itch")}`,
      `  ${toLink(dst, "bluesky")}`,
      `  ${toLink(dst, "instagram")}`,
      `  ${toLink(dst, "twitter")}`,
      `  ${toLink(dst, "other")}`,
      `description:`,
      `---`,
    ]

    const markdown = lines.join("\n")

    const fileName = toFileName(dst, datePrefix)
    const filePath = join(k.eventsDir, fileName)

    writeFile(filePath, markdown)
  })

  await Promise.all(writes)
}

// -- queries --
function mapEvent(src) {
  return {
    name: src.description.trim(),
    date: mapDate(src),
    links: mapLinks(src),
  }
}

function mapDate(src) {
  const whenParts = src.when.split(" ")

  const dateString = whenParts[0]
  const timeString = whenParts[1] ?? "00:00:AM"

  const timeParts = timeString.split(":")
  if (timeParts[2] == "PM") {
    timeParts[0] = Number.parseInt(timeParts[0]) + 12
  }

  const date = new Date(`${dateString}T${timeParts.slice(0, 2).join(":")}`)

  return date
}

function mapLinks(event) {
  const url = event.url
  if (url == null) {
    return {}
  }

  if (url.startsWith("https://www.eventbrite.com/")) {
    return { tickets: url }
  } else if (url.startsWith("https://itch.io/")) {
    return { itch: url }
  } else if (url.startsWith("https://www.instagram.com/")) {
    return { instagram: url }
  } else {
    return { other: url }
  }
}

function toFileName(dst, datePrefix) {
  const name = dst.name
    .replaceAll(/[']+/g, "")
    .split(/\W+/)
    .filter((p) => p != null && p.length > 0)
    .map((p) => p.toLowerCase())
    .join("-")

  return `${datePrefix}-${name}.md`
}

function toLink(dst, name) {
  let url = dst.links[name]
  if (url != null) {
    url = ` ${url}`
  } else {
    url = ""
  }

  return `${name}:${url}`
}

function toIsoDateTimeString(date) {
  return `${toIsoDateString(date)}T${toIsoTimeString(date)}`
}

function toIsoDateString(date) {
  return `${pad(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function toIsoTimeString(date) {
  const tzo = -date.getTimezoneOffset()
  const tzoHrs = Math.floor(Math.abs(tzo) / 60)
  const tzoMin = Math.abs(tzo) % 60
  const dir = tzo >= 0 ? "+" : "-"
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${date.getSeconds()}${pad(dir)}${pad(tzoHrs)}:${pad(tzoMin)}`
}

function pad(num) {
  return num.toString().padStart(2, "0")
}

// -- data --
const events = [
  {
    when: "2024-10-17 10:00:AM",
    description: "open coworking thursday!",
  },
  {
    when: "2024-10-17 06:00:PM",
    description: "LAN party night: Tribes 2",
  },
  {
    when: "2024-11-07",
    description: "boshis radical day (more info coming)",
  },
  {
    when: "2024-10-26 07:30:PM",
    description: "day of dry bones",
  },
  {
    when: "2024-10-03 10:00:AM",
    description: "open coworking thursday!",
  },
  {
    when: "2024-09-28 08:00:PM",
    description: "BIG gaming event (with mario party)",
    url: "https://www.instagram.com/p/DAMA3foyHh6/",
  },
  {
    when: "2024-09-18 07:30:PM",
    description: "boshi's cinema presents: castaway on the moon",
  },
  {
    when: "2024-09-22 07:00:PM",
    description: "farewell summer",
    url: "https://itch.io/c/4812830/farewell-summer-2024",
  },
  {
    when: "2024-09-11 07:00:PM",
    url: "https://www.instagram.com/p/C_Ybtzvu4K-/",
    description: "lan party night: warcraft 3 mods",
  },
  {
    when: "2024-08-29 07:00:PM",
    url: "https://www.instagram.com/p/C-DdekQuRyv/",
    description:
      "music show: onu blu, casual salad, gushes, awryly; with games curated by flan",
  },
  {
    when: "2024-08-07 07:30:PM",
    url: "https://www.instagram.com/p/C-DdekQuRyv/",
    description: "boshi's cinema presents: one cut of the dead",
  },
  {
    when: "2024-07-26 07:30:PM",
    url: "https://itch.io/c/4617669/olympics-show-2024",
    description: "olympic games opening ceremony + curated games",
  },
  {
    when: "2024-07-19",
    end: "2024-07-20",
    url: "events/2024-07-19-young-egg-dog-city.html",
    description:
      "young egg dog city: an exhibition of pointy-clicky games made between 1988 and 2024",
  },
  {
    when: "2024-07-14 02:00:PM",
    end: "2024-07-21",
    url: "https://itch.io/jam/plunderludics-workshop-jam",
    description: "plunderludics workshop",
  },
  {
    when: "2024-06-15 08:00:PM",
    url: "https://itch.io/c/4633134/crockpot-launch-party",
    description: "crockpot launch party",
  },
  {
    when: "2024-05-14 07:30:PM",
    url: "https://www.instagram.com/p/C6Z-r89Nr1t/",
    description:
      "live concert feat. dreamcrusher, pain chain, professor a, and compactor",
  },
  {
    when: "2024-04-27 07:00:PM",
    url: "https://www.instagram.com/p/C6IJXSxNF4C/",
    description:
      "which came first, the chicken or the egg? prototype playtest and pitch night!",
  },
  {
    when: "2024-04-26 07:00:PM",
    url: "https://www.instagram.com/p/C6Enhs1OT2e/",
    description: "boshi's cinema presents: speed racer (2008)",
  },
  {
    when: "2024-04-19 07:00:PM",
    url: "https://www.instagram.com/p/C5q-EAIx8QZ/",
    description:
      "games for a rainy day launch party featuring McTheProfessor.gov",
  },
  {
    when: "2024-04-12 07:00:PM",
    url: "https://www.instagram.com/p/C4ipBolOXL3/",
    description:
      "boshi noise show featuring: Holy Wisdom LLC, Luciform, Mercury Symbol, Jenn Taiga, Chthonic Streams",
  },
  {
    when: "2024-04-06 07:00:PM",
    url: "soon.html",
    description: "boshi's first birthday!!!!",
  },
  {
    when: "2024-03-30 07:00:PM",
    url: "https://www.instagram.com/reel/C4qwUCjO1Ce/",
    description: "eggztravaganza",
  },
  {
    when: "2024-03-08 07:00:PM",
    url: "https://www.instagram.com/p/C3-vcb-u759/",
    description: "boshi's cinema presents: Bacurau (2019)",
  },
  {
    when: "2024-03-02 07:00:PM",
    url: "https://www.instagram.com/p/C3lbuneOcZV/",
    description:
      "live concert feat. No One and the Somebodies, Alan Worm, Old Table Reunion, Crystal Lies, Timeless Clock",
  },
  {
    when: "2024-02-16",
    url: "https://www.instagram.com/p/C3ZPgxdN4on/",
    description: "boshi's cinema presents: wings of desire (1987)",
  },
  {
    when: "2024-02-09",
    url: "https://www.instagram.com/p/C2sL16QuRU6/",
    description: "teach in: nyc resists with gaza",
  },
  {
    when: "2023-12-16",
    url: "https://www.instagram.com/p/C0ucdVsyiuV/",
    description: "prototype showcase",
  },
  {
    when: "2023-12-09",
    url: "https://www.instagram.com/p/Cz9rmO2ux9i/",
    description: "raindrop races: an ambient play showcase",
  },
  {
    when: "2023-12-07",
    url: "https://www.instagram.com/p/C0e2J0DO3wl/",
    description: "open studio - come cowork with us!",
  },
  {
    when: "2023-12-02 07:00:PM",
    url: "https://www.instagram.com/p/C0MoA_6u8Lx/",
    description: "boshi's cinema presents: first cow (2019)",
  },
  {
    when: "2023-11-27",
    url: "https://www.eventbrite.com/e/barnyardia-direct-cyber-monday-the-first-scrapeboard-kit-auction-live-tickets-754801209737",
    description:
      "Barnyardia Direct: CYBER MONDAY - the first Scrapeboard kit auction live!",
  },
  {
    when: "2023-11-11 07:00:PM",
    url: "https://www.instagram.com/p/CzW9yieO6MH/",
    description: "boshi's cinema presents: mind game",
  },
  {
    when: "2023-11-03",
    url: "https://www.instagram.com/p/CzE4LaUOAyn/",
    description: "documentary screening: gaza fights for freedom (2019)",
  },
  {
    when: "2023-10-21",
    url: "events/dayOfDryBones_2023.html",
    description: "day of dry bones",
  },
  {
    when: "2023-10-12",
    url: "https://www.instagram.com/p/CyG32I5OdJE/",
    description:
      "NIGHTMARE NIGHTMARE NIGHTMARE: noise + experimental music + performances feat. phagocyte, seventh trumpet, ZACARAMA!, cancer cult, LUCIFORM",
  },
  {
    when: "2023-09-22",
    url: "https://www.instagram.com/p/CxQ1evju_c1/",
    description: "spontaneous compositon: a music and games performance",
  },
  {
    when: "2023-09-22",
    end: "2023-09-24",
    url: "https://artsinbushwick.org/bos2023-map-1/",
    description: "Bushwick Open Studios 2023",
  },
  {
    when: "2023-09-16",
    end: "2023-09-17",
    url: "https://www.eventbrite.com/e/tableau-vivant-a-weekend-of-experiential-games-tickets-707095420437",
    description: " Tableau Vivant: a weekend of experiential games",
  },
  {
    when: "2023-08-19",
    url: "https://www.instagram.com/p/CwHCTIsuPG7/",
    description: "live drawing @ Boshi",
  },
  {
    when: "2023-08-18",
    url: "https://www.instagram.com/p/CwHBv-FuvlJ/",
    description:
      "music art show: soft lives, simpe, thanks god, misty xelibri & stuttersprite",
  },
  {
    when: "2023-07-14",
    description: " White Death (larp)",
  },
  {
    when: "2023-07-08",
    url: "https://www.eventbrite.com/e/folk-drinking-game-jam-tickets-670371257477",
    description: "Folk Drinking Game Jam",
  },
  {
    when: "2023-06-24",
    url: "https://www.eventbrite.com/e/thanks-for-shopping-with-us-a-salute-to-big-bag-tickets-649806026317",
    description: "Thanks for Shopping With Us - A Salute to Big Bag",
  },
  {
    when: "2023-06-18",
    url: "https://www.eventbrite.com/e/continental-breakfast-select-flash-games-from-2001-2008-tickets-660688315537",
    description: " Continental Breakfast: select flash game from 2001 to 2008",
  },
  {
    when: "2023-06-17",
    url: "https://www.eventbrite.com/e/zine-jam-tickets-660691495047",
    description: "zine jam!!!",
  },
]

// -- bootstrap --
Main()
