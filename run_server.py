import subprocess

def run_cmd():
    # Run the "node server.js" command
    subprocess.run(["node", "server.js"], check=True)


if __name__ == "__main__":
    print("Starting server...")
    run_cmd()