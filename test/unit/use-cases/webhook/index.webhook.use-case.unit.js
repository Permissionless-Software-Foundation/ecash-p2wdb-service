/*
  Unit tests for the Entry Use Case index.js library.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const EntryUseCases = require('../../../../src/use-cases/entry/')

// Mocks
const adaptersMock = require('../../mocks/adapters')

describe('#EntryUseCases', () => {
  let uut
  let sandbox

  beforeEach(() => {
    uut = new EntryUseCases({
      adapters: adaptersMock
    })

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not included', () => {
      try {
        uut = new EntryUseCases()

        assert.fail('Unexpected code path')
        console.log(uut)
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating Entry Use Cases library.'
        )
      }
    })
  })
})
