#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;

fn main() {
    // Start Spring Boot Backend
    Command::new("java")
        .args(["-jar", "bin/app.jar","--spring.profiles.active=prod"])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start backend server");

    // Wait a few seconds for Spring Boot to be ready
    thread::sleep(Duration::from_secs(2));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
