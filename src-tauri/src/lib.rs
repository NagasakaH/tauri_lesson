// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    db::initialize_db().expect("failed to initialize db");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![db::add_memo, db::get_memos, db::update_memo, db::delete_memo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
