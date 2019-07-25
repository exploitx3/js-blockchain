const ChainUtil = require('../chain-util')
const { DIFFICULTY, MINE_RATE } = require('../config')

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty || DIFFICULTY
  }

  toString() {
    return `Block -
    Timestamp : ${this.timestamp}
    Last Hash : ${this.lastHash.substring(0, 10)}
    Hash      : ${this.hash.substring(0, 10)}
    Nonce     : ${this.nonce}
    Difficulty: ${this.difficulty}
    Data      : ${this.data}`
  }

  static genesis() {
    return new this('Genesis Time', '-----', 'f1r57-h45h', [], 0, DIFFICULTY)
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    let { difficulty } = lastBlock
    let nonce = 0
    let hash

    do {
      nonce++
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty)
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))


    return new this(timestamp, lastHash, hash, data, nonce, difficulty)
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 :
      difficulty - 1

    return difficulty
  }

  static blockHash(block) {
    return Block.hash(block.timestamp, block.lastHash, block.data, block.nonce, block.difficulty)
  }
}

module.exports = Block