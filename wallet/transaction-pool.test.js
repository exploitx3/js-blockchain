const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const Blockchain = require('../blockchain')

describe('TransactionPool', function () {
  let tp, wallet, transaction, bc

  beforeEach(() => {
    bc = new Blockchain()
    tp = new TransactionPool()
    wallet = new Wallet()
    transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp)
  })

  it('adds a transaction to the pool', function () {
    expect(tp.transactions.find(t => t.id === transaction.id))
      .toEqual(transaction)
  })

  it('updates a transaction in the pool', function () {
    const oldTransaction = JSON.stringify(transaction)
    const newTransaction = transaction.update(wallet, 'f00-4ddr355', 40)
    tp.updateOrAddTransaction(newTransaction)

    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction)
  })

  it('clears the pool', function () {
    tp.clear()

    expect(tp.transactions).toEqual([])
  })

  describe('mixing valid and corrupt transactions', function () {
    let validTransactions

    beforeEach(() => {
      validTransactions = [...tp.transactions]
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet()
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp)
        if (i % 2 === 0) {
          transaction.input.amount = 999999
        } else {
          validTransactions.push(transaction)
        }
      }
    })


    it('shows a difference between valid and corrupt transactions', function () {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
    })

    it('grabs valid transactions', function () {
      expect(tp.validTransactions()).toEqual(validTransactions)
    })
  })
})