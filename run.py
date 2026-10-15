"""
AquaGuard AI — Single Terminal Full-Stack Runner
Runs both the Python FastAPI backend and React Vite frontend concurrently in ONE terminal.
Press Ctrl+C at any time to gracefully shut down both services.
"""

import sys
import os
import subprocess
import signal
import time
import threading

def stream_output(process, prefix, color_code):
    reset_code = "\033[0m"
    try:
        for line in iter(process.stdout.readline, ""):
            if not line:
                break
            print(f"{color_code}[{prefix}]{reset_code} {line.rstrip()}", flush=True)
    except Exception:
        pass

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("\033[1;36m========================================================\033[0m")
    print("\033[1;36m   AquaGuard AI — Unified Single-Terminal Runner        \033[0m")
    print("\033[1;36m   Backend  : http://localhost:8000                    \033[0m")
    print("\033[1;36m   Frontend : http://localhost:3000                    \033[0m")
    print("\033[1;36m   Press Ctrl+C at any time to stop both services       \033[0m")
    print("\033[1;36m========================================================\033[0m\n", flush=True)

    # 1. Start Python FastAPI backend
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.app.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
    ]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=root_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    # 2. Start React Vite frontend
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    # Stream logs with distinct colors (Green for Backend, Blue for Frontend)
    GREEN = "\033[32m"
    BLUE = "\033[34m"

    t1 = threading.Thread(target=stream_output, args=(backend_proc, "BACKEND", GREEN), daemon=True)
    t2 = threading.Thread(target=stream_output, args=(frontend_proc, "FRONTEND", BLUE), daemon=True)
    t1.start()
    t2.start()

    def shutdown(sig, frame):
        print("\n\033[1;33mShutting down AquaGuard AI services...\033[0m", flush=True)
        try:
            frontend_proc.terminate()
            backend_proc.terminate()
            if sys.platform == "win32":
                subprocess.run(f"taskkill /F /T /PID {frontend_proc.pid}", shell=True, capture_output=True)
                subprocess.run(f"taskkill /F /T /PID {backend_proc.pid}", shell=True, capture_output=True)
        except Exception:
            pass
        print("\033[1;32mAll services stopped cleanly.\033[0m", flush=True)
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    # Wait for either process to terminate
    while True:
        b_ret = backend_proc.poll()
        f_ret = frontend_proc.poll()
        if b_ret is not None or f_ret is not None:
            shutdown(None, None)
            break
        time.sleep(0.5)

if __name__ == "__main__":
    main()

