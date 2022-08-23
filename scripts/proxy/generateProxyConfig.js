#!/usr/bin/env node
const path = require("path")
const fs = require("fs")

function processStringSync(string, env) {
  let output = ""

  // process if statements
  let removal = false
  for (let line of string.split("\n")) {
    if (new RegExp(`{{\/if}}`, "g").test(line)) { 
      removal = false
      continue
    } 

    if (!removal) {
      const match = line.match(new RegExp(`{{#if (.*)}}`))
      if (match) {
        const key = match[1]
        // check the if statement is true
        if (!env[key]) {
          removal = true
        }
        continue
      }
      output += line + "\n"
    }
  }

  for (let key in env) {
    // replace variables
    const rgx = new RegExp(`{{\\s*${key}\\s*}}`, "g")
    output = output.replace(rgx, env[key])
  }

  return output
}

const Configs = {
  k8s: {},
  compose: {
    watchtower: true,
  },
}

const Commands = {
  k8s: "k8s",
  Compose: "compose",
}

async function init(managementCommand) {
  const config = Configs[managementCommand]
  const hostingPath = path.join(process.cwd(), "hosting")
  const nginxHbsPath = path.join(hostingPath, "nginx.prod.conf.hbs")
  const nginxOutputPath = path.join(
    hostingPath,
    "proxy",
    ".generated-nginx.prod.conf"
  )
  const contents = fs.readFileSync(nginxHbsPath, "utf8")
  fs.writeFileSync(nginxOutputPath, processStringSync(contents, config))
}

const managementCommand = process.argv.slice(2)[0]

if (
  !managementCommand ||
  !Object.values(Commands).some(command => managementCommand === command)
) {
  throw new Error(
    "You must supply either a 'compose' or 'k8s' commmand to generate an NGINX config."
  )
}

init(managementCommand)
  .then(() => {
    console.log("Done! 🎉")
  })
  .catch(err => {
    console.error(
      "Something went wrong while creating the nginx configuration",
      err.message
    )
  })
