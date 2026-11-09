use axum::{extract::{Path, Query, State}, Json};
use super::Pagination;
use crate::{error::ApiError, models::Transaction, state::AppState};

pub async fn list_transactions(
    State(state): State<AppState>,
    Query(p): Query<Pagination>,
) -> Json<Vec<Transaction>> {
    let (page, limit) = p.resolve();
    let chain = state.chain.read().await;
    Json(
        chain.iter().rev()
            .flat_map(|b| b.transactions.iter())
            .skip(page * limit).take(limit)
            .cloned().collect(),
    )
}

pub async fn get_transaction(
    State(state): State<AppState>,
    Path(hash): Path<String>,
) -> Result<Json<Transaction>, ApiError> {
    let chain = state.chain.read().await;
    chain.iter()
        .flat_map(|b| b.transactions.iter())
        .find(|t| t.hash == hash)
        .cloned()
        .map(Json)
        .ok_or_else(|| ApiError::NotFound(format!("transaction {hash}")))
}