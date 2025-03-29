// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod db;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    db::initialize_db().expect("failed to initialize db");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![db::add_memo, db::get_memos])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
