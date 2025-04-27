#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    path::PathBuf,
    process::{Child, Command},
    sync::{Arc, Mutex},
};

use tauri::{Manager, RunEvent};

use tauri::path::BaseDirectory;

fn main() {
    let java_process = Arc::new(Mutex::new(None));

    tauri::Builder::default()
        .setup({
            let java_process = Arc::clone(&java_process);
            move |app| {
                let app_handle = app.handle();

                // Correct resolve with 2 arguments
                let java_path=PathBuf::from("java")
                let jar_path = app_handle
                    .path()
                    .resolve("bin/app.jar", BaseDirectory::Resource)
                    .expect("Failed to resolve path to bundled JAR");

                let child = Command::new(&java_path)
                    .args(&["-jar", jar_path.to_str().unwrap(),"--spring.profiles.active=prod"])
                    .spawn()?;

                *java_process.lock().unwrap() = Some(child);
                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run({
            let java_process = Arc::clone(&java_process);
            move |_app_handle, event| {
                if let RunEvent::ExitRequested { .. } = event {
                    if let Some(mut child) = java_process.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
            }
        });
}
