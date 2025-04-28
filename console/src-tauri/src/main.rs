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

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn main() {
    let java_process = Arc::new(Mutex::new(None));

    tauri::Builder::default()
        .setup({
            let java_process = Arc::clone(&java_process);
            move |app| {
                let app_handle = app.handle();

         let java_path = PathBuf::from("java");
                let jar_path = app_handle
                    .path()
                    .resolve("bin/my-app.jar", BaseDirectory::Resource)
                    .expect("Failed to resolve JAR path");

                // Check if paths exist
                assert!(java_path.exists(), "Java executable not found at {:?}", java_path);
                assert!(jar_path.exists(), "JAR file not found at {:?}", jar_path);

                // Spawn Java backend
                let mut cmd = Command::new(java_path);
                cmd.args(&["-jar", jar_path.to_str().unwrap()]);

                #[cfg(target_os = "windows")]
                {
                    cmd.creation_flags(CREATE_NO_WINDOW);
                }

                let child = cmd.spawn()?;
                *java_process.lock().unwrap() = Some(child);

                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri app")
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
