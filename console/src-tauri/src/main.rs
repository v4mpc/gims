#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]


use std::process::Command;
use std::thread;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Start Spring Boot server in a background thread
            thread::spawn(|| {
                let java = if cfg!(target_os = "windows") {
                    "java.exe"
                } else {
                    "java"
                };

                let result = Command::new(java)
                    .args(&["-jar", "bin/app.jar","--spring.profiles.active=dev"])
                    .spawn();

                match result {
                    Ok(_child) => {
                        println!("Spring Boot server started successfully.");
                    },
                    Err(e) => {
                        println!("Failed to start Spring Boot server: {:?}", e);
                    }
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
