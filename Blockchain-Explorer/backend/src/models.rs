use serde::Serialize;
// use serde::Deserialize;

#[derive(Debug, Clone, Copy, Serialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum TxStatus {
    Confirmed,
    Pending,
}

#[derive(Debug, Clone, Serialize)]
pub struct Transaction {
    pub hash: String,
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub fee: u64,
    pub timestamp: i64,
    pub block_height: u64,
    pub status: TxStatus,
}

#[derive(Debug, Clone, Serialize)]
pub struct Block {
    pub height: u64,
    pub hash: String,
    pub prev_hash: String,
    pub timestamp: i64,
    pub nonce: u64,
    pub transactions: Vec<Transaction>,
}

#[derive(Serialize)]
pub struct AddressInfo {
    pub address: String,
    pub balance: i128,
    pub tx_count: usize,
    pub transactions: Vec<Transaction>,
}

#[derive(Serialize)]
pub struct Stats {
    pub height: u64,
    pub total_transactions: usize,
    pub total_addresses: usize,
    pub latest_block_hash: String,
}