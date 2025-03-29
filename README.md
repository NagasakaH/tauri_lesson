# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## インターフェース定義更新後は下記のコマンドを実行すること

下記のコマンドを実行するとrustの構造体を読み取って自動でtsファイルを生成してくれる

```bash
cargo test export_bindings
```

## LinuxでWindows向けの実行ファイルをビルドする

エクスペリメンタルみたいなので手順が変わるかも

https://v2.tauri.app/distribute/windows-installer/

インストール不要のexeを作るために下記の手順も参考にした

https://qiita.com/takavfx/items/8f342b84a6d124a4065e

```bash
sudo apt install nsis
sudo apt install lld llvm
sudo apt install clang # 手順にはないが入れないとダメだった
rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
pnpm tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc
```

