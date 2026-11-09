mod error;
mod models;
mod routes;
mod seed;
mod state;

use std::{sync::Arc, time::Duration};
use tokio::{net::TcpListener, sync::RwLock};
use tower_http::cors::{Any, CorsLayer};
use state::AppState;

#[tokio::main]
async fn main() {
    // Build an initial chain: genesis + 20 blocks
    let mut chain = vec![seed::genesis()];

    for _ in 0..20 {
        let next = seed::next_block(chain.last().unwrap());
        chain.push(next);
    }

    let state = AppState {
        chain: Arc::new(RwLock::new(chain)),
    };

    // Background task: a new block every 10 seconds
    let producer = state.clone();

    tokio::spawn(async move {
        let mut tick = tokio::time::interval(Duration::from_secs(10));

        loop {
            tick.tick().await;

            let mut chain = producer.chain.write().await;
            let next = seed::next_block(chain.last().unwrap());

            chain.push(next);
        }
    });

    let app = axum::Router::new()
        .nest("/api", routes::router())
        .with_state(state)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let listener = TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    println!("Explorer API → http://localhost:3001/api");

    axum::serve(listener, app).await.unwrap();
}