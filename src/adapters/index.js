/*
  This is a top-level library that encapsulates all the additional Adapters.
  The concept of Adapters comes from Clean Architecture:
  https://troutsblog.com/blog/clean-architecture
*/

// Public NPM libraries
const BCHJS = require('@psf/bch-js')

// Load individual adapter libraries.
const IPFSAdapter = require('./ipfs')
const LocalDB = require('./localdb')
const LogsAPI = require('./logapi')
const Passport = require('./passport')
const Nodemailer = require('./nodemailer')
// const { wlogger } = require('./wlogger')
const JSONFiles = require('./json-files')
const FullStackJWT = require('./fullstack-jwt')
const P2WDB = require('./p2wdb')
const EntryAdapter = require('./entry')
const WebhookAdapter = require('./webhook')
const WritePrice = require('./write-price')

const config = require('../../config')

class Adapters {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.ipfs = new IPFSAdapter()
    this.localdb = new LocalDB()
    this.logapi = new LogsAPI()
    this.passport = new Passport()
    this.nodemailer = new Nodemailer()
    this.jsonFiles = new JSONFiles()
    this.bchjs = new BCHJS()
    this.p2wdb = new P2WDB()
    this.entry = new EntryAdapter()
    this.webhook = new WebhookAdapter()
    this.writePrice = new WritePrice()

    this.config = config

    // Get a valid JWT API key and instance bch-js.
    this.fullStackJwt = new FullStackJWT(config)
  }

  async start () {
    try {
      if (this.config.getJwtAtStartup) {
        // Get a JWT token and instantiate bch-js with it. Then pass that instance
        // to all the rest of the apps controllers and adapters.
        await this.fullStackJwt.getJWT()
        // Instantiate bch-js with the JWT token, and overwrite the placeholder for bch-js.
        this.bchjs = await this.fullStackJwt.instanceBchjs()
      }

      await this.writePrice.getWriteCost()

      // Start the IPFS node.
      await this.ipfs.start({ bchjs: this.bchjs })

      // Start the P2WDB
      await this.p2wdb.start({ ipfs: this.ipfs.ipfs, bchjs: this.bchjs })

      return true
    } catch (err) {
      console.error('Error in adapters/index.js/start()')
      throw err
    }
  }
}

module.exports = Adapters
