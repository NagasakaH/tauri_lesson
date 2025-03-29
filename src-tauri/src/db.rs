use core::result::Result;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize,TS)]
#[ts(export, export_to = "memo.ts")]
pub struct Memo {
    pub id: i32,
    pub title: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub content: String,
}

pub fn initialize_db() -> Result<(), rusqlite::Error> {
    let conn = Connection::open("memo.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS memo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            content TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

#[tauri::command]
pub fn add_memo(title: &str, content: &str) -> Result<Memo, String> {
    println!("add_memo: title={}, content={}", title, content);
    let conn = match Connection::open("memo.db") {
        Ok(value) => value,
        Err(_error) => return Err("データベース接続失敗".to_string()),
    };
    let now = match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(value) => value.as_secs() as i64,
        Err(_error) => return Err("現在時刻取得失敗".to_string()),
    };
    let result = match conn.execute(
        "INSERT INTO memo (title, created_at, updated_at, content) VALUES (?1, ?2, ?3, ?4)",
        params![title, now, now, content],
    ) {
        Ok(_) => {
            let id = conn.last_insert_rowid() as i32;
            Ok(Memo {
                id,
                title: title.to_string(),
                created_at: now,
                updated_at: now,
                content: content.to_string(),
            })
        }
        Err(_error) => Err("メモの追加に失敗".to_string()),
    };
    return result;
}

#[tauri::command]
pub fn get_memos() -> Result<Vec<Memo>, String> {
    let conn = match Connection::open("memo.db") {
        Ok(value) => value,
        Err(_error) => return Err("データベース接続失敗".to_string()),
    };
    let mut stmt = match conn.prepare("SELECT id, title, created_at, updated_at, content FROM memo")
    {
        Ok(value) => value,
        Err(_error) => return Err("メモの取得に失敗".to_string()),
    };
    let memo_iter = stmt
        .query_map([], |row| {
            Ok(Memo {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
                content: row.get(4)?,
            })
        })
        .unwrap();

    let mut memos = Vec::new();
    for memo in memo_iter {
        memos.push(memo.unwrap());
    }
    Ok(memos)
}

// #[tauri::command]
// pub fn update_memo(id: i32, title: &str, content: &str) -> Result<()> {
//     let conn = Connection::open("memo.db")?;
//     let now = SystemTime::now()
//         .duration_since(UNIX_EPOCH)
//         .map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?
//         .as_secs() as i64;
//     conn.execute(
//         "UPDATE memo SET title = ?1, updated_at = ?2, content = ?3 WHERE id = ?4",
//         params![title, now, content, id],
//     )?;
//     Ok(())
// }
//
// #[tauri::command]
// pub fn delete_memo(id: i32) -> Result<()> {
//     let conn = Connection::open("memo.db")?;
//     conn.execute("DELETE FROM memo WHERE id = ?1", params![id])?;
//     Ok(())
// }
