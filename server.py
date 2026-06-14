#!/usr/bin/env python3
import subprocess
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


GAMMA_ORIGIN = "https://gamma-api.polymarket.com"
GATEWAY_ORIGIN = "https://gateway.polymarket.us"


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/gamma/"):
            self.proxy_origin("/api/gamma", GAMMA_ORIGIN)
            return
        if self.path.startswith("/api/gateway/"):
            self.proxy_origin("/api/gateway", GATEWAY_ORIGIN)
            return
        super().do_GET()

    def proxy_origin(self, prefix, origin):
        target_path = self.path[len(prefix) :]
        parsed = urlsplit(target_path)
        if ".." in parsed.path:
            self.send_error(400, "Invalid path")
            return

        target_url = f"{origin}{target_path}"
        try:
            result = subprocess.run(
                [
                    "curl",
                    "-L",
                    "--connect-timeout",
                    "10",
                    "--max-time",
                    "30",
                    "-sS",
                    "-H",
                    "Accept: application/json",
                    "-H",
                    "User-Agent: polymarket-goal-pulse-local-proxy",
                    target_url,
                ],
                check=False,
                capture_output=True,
            )
        except OSError as error:
            self.write_response(500, "text/plain; charset=utf-8", str(error).encode("utf-8"))
            return

        if result.returncode != 0:
            body = result.stderr or result.stdout or f"curl failed with code {result.returncode}".encode("utf-8")
            self.write_response(502, "text/plain; charset=utf-8", body)
            return

        self.write_response(200, "application/json", result.stdout)

    def write_response(self, status, content_type, body):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    server = ThreadingHTTPServer(("127.0.0.1", 5173), Handler)
    print("Serving Polymarket Goal Pulse at http://127.0.0.1:5173")
    server.serve_forever()


if __name__ == "__main__":
    main()
