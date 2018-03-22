//——————————————————————————block部分————————————————————————————————
const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }
}
//————————————————————————blockchain部分————————————————————————————————
class Blockchain{
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }
  //初始化区块
  createGenesisBlock() {
    return new Block(0, "01/01/2017", "Genesis block", "0");
  }
 //返回最新的区块
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
 //添加区块
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;//新区块的前HASH等于链上面上一个区块的HASH
    newBlock.hash = newBlock.calculateHash(); //加密计算新的区块HASH值
    this.chain.push(newBlock); //初始区块为基础，新增区块
  }
//确保区块没有被篡改
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}
//————————————————————————————————————调用部分——————————————————————————————————
let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));//区块连新增加两个区块


console.log('Blockchain valid? ' + savjeeCoin.isChainValid());//由于两个区划是前后关系，正常增加的，所以

console.log('Changing a block...');
savjeeCoin.chain[1].data = { amount: 100 };//chain[0]是初始区块，chain[1]为index=1的区块，chain[2]为index=2的区块
// savjeeCoin.chain[1].hash = savjeeCoin.chain[1].calculateHash();

console.log("Blockchain valid? " + savjeeCoin.isChainValid());//这里修改chain[0]还是true,因为chain[0]是初始的，没有上一个区块
//也就是说区块链只跟上一个区块有关系

// console.log(JSON.stringify(savjeeCoin, null, 4));
