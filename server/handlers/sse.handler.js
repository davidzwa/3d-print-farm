class SseHandler {
  #clientId = 0;
  #clients = {
    default: [],
  };

  constructor({}) {}

  handleRequest(req, res, topic = "default") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: 0,
      Connection: "keep-alive",
    });
    res.write("\n");
    const newClientId = this.#clientId;
    if (!this.#clients[topic]?.length) {
      this.#clients[topic] = [res];
    } else {
      this.#clients[topic][newClientId] = res;
    }
    this.#clientId++;

    req.on("close", () => {
      delete this.#clients[topic][newClientId];
    });
    req.on("error", () => {
      delete this.#clients[topic][newClientId];
    });
  }

  send(data, topic = "default") {
    if (!this.#clients[topic]) {
      this.#clients[topic] = [];
    }
    this.#clients[topic].forEach((c) => {
      c.write("data: " + data + "\n\n");
    });
  }
}

module.exports = SseHandler;
