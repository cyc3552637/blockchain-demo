const SHA256 = require("crypto-js/sha256");

//————————————————————————————————————交易部分——————————————————————————————————
class Transaction{                              
    constructor(fromAddress, toAddress, amount){ //交易数据
        this.fromAddress = fromAddress;          //fromAddress发起交易地址，发起是付款
        this.toAddress = toAddress;             //toAddress接收交易地址发，接收是收款
        this.amount = amount;                   //账户
    }
}

//——————————————————————————block部分————————————————————————————————
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions; //transactions作为交易数据
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
         //	console.log(this.hash.substring(0, difficulty));   截取hash的前两位
        //	console.log(Array(difficulty + 1).join("0"));      表示00
        //表示只有hash的前两位是00才可以，否则nonce+1
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);//得到的复杂hash
    }
}

//————————————————————————blockchain部分————————————————————————————————
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];    //区块之间交易在链上存储
        this.miningReward = 100;          //挖矿的回报
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){  //挖矿过程
    	
    	// 将所有区块创建的交易，带还是待处理的，创建新的区块并且开挖
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty); //开始挖矿，得到复杂hash
        // 这样block就有了完整的信息：日期、待处理的交易信息、上一个的hash、自身的hash
        console.log('Block successfully mined!');
        this.chain.push(block);//将区块加入链中
        
        //因为是挖矿，所以地址方发起方为null,接收地址为奖励地址，账户增加奖励信息
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){ //创建交易
        this.pendingTransactions.push(transaction);//待处理交易数组
    }

    getBalanceOfAddress(address){ //检查账户
        let balance = 0;
        // 遍历每个区块以及每个区块内的交易
        for(const block of this.chain){
            for(const trans of block.transactions){
            	// 如果地址是发起方 -> 减少余额
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                // 如果地址是接收方 -> 增加余额
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
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
//————————————————————————————————————调用部分——————————————————————————————————
let savjeeCoin = new Blockchain();
//创建了两个交易，address1给address2 100，address2给address1 50
savjeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
savjeeCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
savjeeCoin.minePendingTransactions('xaviers-address');//进行挖矿，只有收账地址

//检查账户，第一次为0，因为系统创建了一个交易，奖励作为新的待处理的交易，下个区块就会有了
console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));

console.log('\n Starting the miner again...');
savjeeCoin.minePendingTransactions('xaviers-address');//进行挖矿，只有收账地址
//再挖一次，账户就进来了
console.log('\nBalance of xavier is', savjeeCoin.getBalanceOfAddress('xaviers-address'));

//交易的，address1是-50，address2是50
console.log('\nBalance of address1 is', savjeeCoin.getBalanceOfAddress('address1'));
console.log('\nBalance of address2 is', savjeeCoin.getBalanceOfAddress('address2'));