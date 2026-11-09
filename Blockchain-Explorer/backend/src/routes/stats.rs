use std::collections::HashSet;
use axum::{extract::State, Json};
use crate::{models::Stats, state::AppState};

pub async fn get_stats(State(state): State<AppState>) -> Json<Stats> {
    let chain = state.chain.read().await;
    let latest = chain.last().expect("chain always has genesis");

    let mut addrs = HashSet::new();
    let mut total = 0;
    for t in chain.iter().flat_map(|b| b.transactions.iter()) {
        total += 1;
        addrs.insert(t.from.as_str());
        addrs.insert(t.to.as_str());
    }

    Json(Stats {
        height: latest.height,
        total_transactions: total,
        total_addresses: addrs.len(),
        latest_block_hash: latest.hash.clone(),
    })
}