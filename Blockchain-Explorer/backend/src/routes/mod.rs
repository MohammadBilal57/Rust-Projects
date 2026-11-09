
use axum::{routing::get, Router};
use serde::Deserialize;
use crate::state::AppState;

mod addresses;
mod blocks;
mod stats;
mod transactions;

#[derive(Deserialize)]
pub struct Pagination {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}

impl Pagination {
    pub fn resolve(&self) -> (usize, usize) {
        let limit = self.limit.unwrap_or(10).min(50);
        (self.page.unwrap_or(0), limit)
    }
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/stats", get(stats::get_stats))
        .route("/blocks", get(blocks::list_blocks))
        .route("/blocks/{id}", get(blocks::get_block))
        .route("/transactions", get(transactions::list_transactions))
        .route("/transactions/{hash}", get(transactions::get_transaction))
        .route("/addresses/{address}", get(addresses::get_address))
}
