/*
  Unit tests for the adapters index.js library
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const Adapters = require('../../../src/adapters')

describe('#adapters', () => {
  let uut, sandbox

  beforeEach(() => {
    uut = new Adapters()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#start', () => {
    it('should start the async adapters', async () => {
      // Mock dependencies
      uut.config.getJwtAtStartup = true
      uut.config.env = 'not-test'
      sandbox.stub(uut.fullStackJwt, 'getJWT').resolves()
      sandbox.stub(uut.fullStackJwt, 'instanceBchjs').resolves()
      sandbox.stub(uut.ipfs, 'start').resolves()
      sandbox.stub(uut.p2wdb, 'start').resolves()
      sandbox.stub(uut.writePrice, 'getCostsFromToken').resolves()
      sandbox.stub(uut.writePrice, 'getCurrentCostPSF').returns(0.133)

      const result = await uut.start()

      assert.equal(result, true)
    })

    it('should enable BCH payments if that flag is set', async () => {
      // Mock dependencies
      uut.config.getJwtAtStartup = true
      uut.config.env = 'not-test'
      sandbox.stub(uut.fullStackJwt, 'getJWT').resolves()
      sandbox.stub(uut.fullStackJwt, 'instanceBchjs').resolves()
      sandbox.stub(uut.ipfs, 'start').resolves()
      sandbox.stub(uut.p2wdb, 'start').resolves()
      sandbox.stub(uut.writePrice, 'getCostsFromToken').resolves()
      sandbox.stub(uut.writePrice, 'getCurrentCostPSF').returns(0.133)

      // Force desired code path
      uut.config.enableBchPayment = true
      sandbox.stub(uut.writePrice, 'getWriteCostInBch').resolves(0.00001)
      sandbox.stub(uut.wallet, 'openWallet').resolves()
      sandbox.stub(uut.wallet, 'instanceWallet').resolves()

      const result = await uut.start()

      assert.equal(result, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        uut.config.env = 'not-test'
        uut.config.enableBchPayment = false
        sandbox.stub(uut.ipfs, 'start').rejects(new Error('test error'))

        await uut.start()

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })
})
