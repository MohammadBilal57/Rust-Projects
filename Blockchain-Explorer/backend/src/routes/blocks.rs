use axum::{extract::{Path, Query, State}, Json};
use super::Pagination;
use crate::{error::ApiError, models::Block, state::AppState};

pub async fn list_blocks(
    State(state): State<AppState>,
    Query(p): Query<Pagination>,
) -> Json<Vec<Block>> {
    let (page, limit) = p.resolve();
    let chain = state.chain.read().await;
    Json(chain.iter().rev().skip(page * limit).take(limit).cloned().collect())
}

// :id can be a height (42) or a block hash
pub async fn get_block(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Block>, ApiError> {
    let chain = state.chain.read().await;
    let found = match id.parse::<usize>() {
        Ok(h) => chain.get(h),
        Err(_) => chain.iter().find(|b| b.hash == id),
    };
    found.cloned().map(Json).ok_or_else(|| ApiError::NotFound(format!("block {id}")))
}