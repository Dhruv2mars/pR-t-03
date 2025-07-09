use std::process::{Command, Stdio};
use std::io::Write;

#[tauri::command]
async fn check_runtime(runtime: String) -> Result<bool, String> {
    let cmd = match runtime.as_str() {
        "python" => Command::new("python3").arg("--version").output(),
        "node" => Command::new("node").arg("--version").output(),
        _ => return Err("Unknown runtime".to_string()),
    };

    match cmd {
        Ok(output) => Ok(output.status.success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn execute_code(
    code: String,
    language: String,
    stdin: Option<String>,
) -> Result<serde_json::Value, String> {
    let (cmd, temp_file) = match language.as_str() {
        "python" => {
            let temp_file = format!("/tmp/temp_{}.py", std::process::id());
            std::fs::write(&temp_file, code).map_err(|e| e.to_string())?;
            ("python3", temp_file)
        }
        "javascript" => {
            let temp_file = format!("/tmp/temp_{}.js", std::process::id());
            std::fs::write(&temp_file, code).map_err(|e| e.to_string())?;
            ("node", temp_file)
        }
        _ => return Err("Unsupported language".to_string()),
    };

    let mut command = Command::new(cmd);
    command.arg(&temp_file);
    command.stdin(Stdio::piped());
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());

    let mut child = command.spawn().map_err(|e| e.to_string())?;

    if let Some(input) = stdin {
        if let Some(stdin_handle) = child.stdin.take() {
            let mut stdin_handle = stdin_handle;
            // Add newline if not present to ensure input is properly terminated
            let input_with_newline = if input.ends_with('\n') {
                input
            } else {
                format!("{}\n", input)
            };
            stdin_handle.write_all(input_with_newline.as_bytes()).map_err(|e| e.to_string())?;
            stdin_handle.flush().map_err(|e| e.to_string())?;
            // Close stdin to signal end of input
            drop(stdin_handle);
        }
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;

    // Clean up temp file
    let _ = std::fs::remove_file(temp_file);

    let result = serde_json::json!({
        "stdout": String::from_utf8_lossy(&output.stdout),
        "stderr": String::from_utf8_lossy(&output.stderr),
        "status": if output.status.success() { "success" } else { "error" },
        "code": output.status.code()
    });

    Ok(result)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![check_runtime, execute_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}