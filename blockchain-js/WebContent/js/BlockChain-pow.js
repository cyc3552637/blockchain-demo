const SHA256 = require("crypto-js/sha256");

//——————————————————————————block部分————————————————————————————————
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0; //Nonce是用来查找一个有效Hash的次数
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) { //新增Nonce的方法，直到它获得有效的Hash
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        //	console.log(this.hash.substring(0, difficulty));   截取hash的前两位
        //	console.log(Array(difficulty + 1).join("0"));      表示00
        //表示只有hash的前两位是00才可以，否则nonce+1
            this.nonce++;                            
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash); //得到的复杂hash,这样就增加了计算难度，很难用垃圾数据填充了
    }
}

//————————————————————————blockchain部分————————————————————————————————
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; //代表区块的hash必须以2个0开头
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

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
//————————————————————————————————————调用部分——————————————————————————————————s
let savjeeCoin = new Blockchain();
console.log('Mining block 1...');
savjeeCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log('Mining block 2...');
savjeeCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));