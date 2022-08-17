const newman = require("newman")

const run = async () => {
  const apiKey = process.env.POSTMAN_API_KEY
  const collectionId = process.env.POSTMAN_COLLECTION
  const environmentId = process.env.POSTMAN_ENVIRONMENT

  const options = {
    collection: `https://api.getpostman.com/collections/${collectionId}?apikey=${apiKey}`,
    environment: `https://api.getpostman.com/environments/${environmentId}?apikey=${apiKey}`,
    //   envVar: "",
    //   globals: "",
    //   globalVar: "",
    //   iterationCount: "",
    //   iterationData: "",
    //   folder: "",
    //   workingDir: ""
    //   insecureFileRead: "",
    //   timeout: "",
    //   timeoutRequest: "",
    //   timeoutScript: "",
    //   delayRequest: "",
    //   ignoreRedirects: "",
    //   insecure: "",
    //   bail: "",
    //   suppressExitCode: "",
    reporters: "cli",
    //   reporter: "",
    //   color: "",
    //   sslClientCert: "",
    //   sslClientKey: "",
    //   sslClientPassphrase: "",
    //   sslClientCertList: "",
    //   sslExtraCaCerts: "",
    //   requestAgents: "",
    //   cookieJar: "",
  }

  newman
    .run(options, err => {
      if (err) {
        throw err
      }
    })
    .on("done", (err, summary) => {
      if (!options.suppressExitCode && (err || summary.run.failures.length)) {
        throw new Error("Newman run failed")
      }
    })
}

run()