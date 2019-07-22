const Block = require('./block')
const { DIFFICULTY } = require('../config')

describe('Block', () => {
  let data, lastBlock, block

  beforeEach(() => {
    data = 'bar'
    lastBlock = Block.genesis()
    block = Block.mineBlock(lastBlock, data)
  })

  it('sets the `data` to match the input', function () {

    expect(block.data).toEqual(data)
  })


  it('sets the `lastHash` to match the hash of the last block', function () {

    expect(block.lastHash).toEqual(lastBlock.hash)
  })

  it('generates a hash that matches the difficulty', function () {
    console.log(block)
    expect(block.hash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY))
  })
})