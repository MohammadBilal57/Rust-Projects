use chrono::Utc;
use rand::RngExt;
// use rand::Rng;
use sha2::{Digest, Sha256};
use crate::models::*;

const NAMES: [&str; 5] = ["alice", "bob", "carol", "dave", "erin"];

fn sha(input: &str) -> String {
    hex::encode(Sha256::digest(input.as_bytes()))
}

pub fn addr(name: &str) -> String {
    format!("0x{}", &sha(name)[..40])
}

pub fn genesis() -> Block {
    let ts = Utc::now().timestamp();

    let transactions = NAMES
        .iter()
        .enumerate()
        .map(|(i, name)| Transaction {
            hash: sha(&format!("genesis-{i}")),
            from: "coinbase".into(),
            to: addr(name),
            amount: 1_000_000,
            fee: 0,
            timestamp: ts,
            block_height: 0,
            status: TxStatus::Confirmed,
        })
        .collect();

    Block {
        height: 0,
        hash: sha("genesis"),
        prev_hash: "0".repeat(64),
        timestamp: ts,
        nonce: 0,
        transactions,
    }
}

pub fn next_block(prev: &Block) -> Block {
    let mut rng = rand::rng();

    let height = prev.height + 1;
    let timestamp = Utc::now().timestamp();
    let tx_count = rng.random_range(1..=5);

    let transactions: Vec<Transaction> = (0..tx_count)
        .map(|i| {
            let a = rng.random_range(0..NAMES.len());
            let b = (a + rng.random_range(1..NAMES.len())) % NAMES.len();

            let (from, to) = (addr(NAMES[a]), addr(NAMES[b]));

            let amount = rng.random_range(1..1_000);
            let fee = rng.random_range(1..10);

            Transaction {
                hash: sha(&format!("{from}{to}{amount}{timestamp}{height}{i}")),
                from,
                to,
                amount,
                fee,
                timestamp,
                block_height: height,
                status: TxStatus::Confirmed,
            }
        })
        .collect();

    let nonce: u64 = rng.random();

    let tx_hashes: String = transactions
        .iter()
        .map(|t| t.hash.as_str())
        .collect();

    let hash = sha(&format!(
        "{height}{}{timestamp}{nonce}{tx_hashes}",
        prev.hash
    ));

    Block {
        height,
        hash,
        prev_hash: prev.hash.clone(),
        timestamp,
        nonce,
        transactions,
    }
}