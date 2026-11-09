use std::sync::Arc;
use tokio::sync::RwLock;
use crate::models::Block;

#[derive(Clone)]
pub struct AppState {
    pub chain: Arc<RwLock<Vec<Block>>>,
}