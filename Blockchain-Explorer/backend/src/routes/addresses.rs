use axum::{extract::{Path, State}, Json};
use crate::{error::ApiError, models::{AddressInfo, Transaction}, state::AppState};

pub async fn get_address(
    State(state): State<AppState>,
    Path(address): Path<String>,
) -> Result<Json<AddressInfo>, ApiError> {
    let chain = state.chain.read().await;
    let mut txs: Vec<Transaction> = chain.iter()
        .flat_map(|b| b.transactions.iter())
        .filter(|t| t.from == address || t.to == address)
        .cloned()
        .collect();

    if txs.is_empty() {
        return Err(ApiError::NotFound(format!("address {address}")));
    }

    let mut balance: i128 = 0;
    for t in &txs {
        if t.to == address { balance += t.amount as i128; }
        if t.from == address { balance -= (t.amount + t.fee) as i128; }
    }
    txs.reverse(); // newest first

    Ok(Json(AddressInfo { address, balance, tx_count: txs.len(), transactions: txs }))
}