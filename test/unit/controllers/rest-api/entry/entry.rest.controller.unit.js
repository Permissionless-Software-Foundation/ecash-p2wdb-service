/*
  Unit tests for the REST API handler for the /users endpoints.
*/

// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
const adapters = require('../../../mocks/adapters')
const UseCasesMock = require('../../../mocks/use-cases')

const EntryController = require('../../../../../src/controllers/rest-api/entry/controller')
let uut
let sandbox
let ctx

const mockContext = require('../../../../unit/mocks/ctx-mock').context

describe('#Entry-REST-Controller', () => {
  // const testUser = {}

  beforeEach(() => {
    const useCases = new UseCasesMock()
    uut = new EntryController({ adapters, useCases })

    sandbox = sinon.createSandbox()

    // Mock the context object.
    ctx = mockContext()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new EntryController()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Adapters library required when instantiating /entry REST Controller.'
        )
      }
    })

    it('should throw an error if useCases are not passed in', () => {
      try {
        uut = new EntryController({ adapters })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Use Cases library required when instantiating /entry REST Controller.'
        )
      }
    })
  })

  describe('#POST /entry', () => {
    it('should return 422 status on biz logic error', async () => {
      try {
        await uut.postEntry(ctx)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.equal(err.status, 422)
        assert.include(err.message, 'Cannot read')
      }
    })

    it('should return 200 status on success', async () => {
      ctx.request.body = {
        txid: 'txid',
        signature: 'signature',
        message: 'message',
        data: 'data',
        appId: 'appId'
      }

      await uut.postEntry(ctx)

      // console.log('ctx.response.body: ', ctx.response.body)

      assert.equal(ctx.response.body.success, true)
    })
  })

  describe('#getAll', () => {
    it('body should contain data', async () => {
      await uut.getAll(ctx)
      // console.log('ctx: ', ctx)

      // Assert that the body data contains the data from the use-case mock.
      assert.property(ctx.body.data, 'key1')
      assert.equal(ctx.body.data.key1, 'value1')
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.entry.readEntry, 'readAllEntries')
          .rejects(new Error('test error'))

        await uut.getAll(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        console.log('err: ', err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getByHash', () => {
    it('body should contain data', async () => {
      ctx.params.hash = 'test'
      await uut.getByHash(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.entry.readEntry, 'readByHash')
          .rejects(new Error('test error'))

        ctx.params.hash = 'test'
        await uut.getByHash(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getByTxid', () => {
    it('body should contain data', async () => {
      ctx.params.txid = 'test'
      await uut.getByTxid(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.entry.readEntry, 'readByTxid')
          .rejects(new Error('test error'))

        ctx.params.txid = 'test'
        await uut.getByTxid(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getByAppId', () => {
    it('body should contain data', async () => {
      ctx.params.appid = 'test'
      await uut.getByAppId(ctx)
      // console.log('ctx.body: ', ctx.body)

      assert.equal(ctx.body.success, true)
    })

    it('should catch and throw an error', async () => {
      try {
        // Force an error
        sandbox
          .stub(uut.useCases.entry.readEntry, 'readByAppId')
          .rejects(new Error('test error'))

        ctx.params.appid = 'test'
        await uut.getByAppId(ctx)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#handleError', () => {
    it('should include error message', () => {
      try {
        const err = {
          status: 404,
          message: 'test message'
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'test message')
      }
    })

    it('should still throw error if there is no message', () => {
      try {
        const err = {
          status: 404
        }

        uut.handleError(ctx, err)
      } catch (err) {
        assert.include(err.message, 'Not Found')
      }
    })
  })
})
