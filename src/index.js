import { onRequest as onTagsRequest } from './api/tags.js';
import { onRequest as onModelsRequest } from './api/models.js';
import { onRequest as onGenerateRequest } from './api/generate.js';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

var SSEToStream = class extends TransformStream {
  static {
    __name(this, "SSEToStream");
  }
  constructor() {
    super({
      transform: /* @__PURE__ */ __name((chunk, controller) => this.processChunk(chunk, controller), "transform"),
      flush: /* @__PURE__ */ __name((controller) => controller.enqueue(this.format({ done: true })), "flush")
    });
  }
  processChunk(chunk, controller) {
    chunk.split("data:").forEach((line) => {
      const match2 = line.match(/{.+?}/);
      if (match2) controller.enqueue(this.format(JSON.parse(match2[0])));
    });
  }
  format(payload) {
    return JSON.stringify({ done: false, ...payload }) + "\n";
  }
};

var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const url = new URL(request.url);
    const CORS_HEADERS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/models') {
      return onModelsRequest({ request, env });
    }
    if (url.pathname === '/api/tags') {
        return onTagsRequest({request, env})
    }
    if (url.pathname === '/api/generate') {
        return onGenerateRequest({request, env});
    }

    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

export {
  pages_template_worker_default as default
};
