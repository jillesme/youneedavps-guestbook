import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth";
import { isProduction, isTurnstileConfigured } from "@/lib/env";

const protectedAuthEndpoints = ["/sign-up/email", "/sign-in/email"];
export const dynamic = "force-dynamic";

function requiresCaptcha(url: string) {
  return protectedAuthEndpoints.some((endpoint) => url.includes(endpoint));
}

function getHandler() {
  return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
  return getHandler().GET(request);
}

export async function POST(request: Request) {
  if (isProduction() && requiresCaptcha(request.url)) {
    if (!isTurnstileConfigured()) {
      return Response.json(
        {
          error: "Turnstile is required for auth in production.",
        },
        { status: 503 },
      );
    }

    if (!request.headers.get("x-captcha-response")) {
      return Response.json(
        {
          error: "Turnstile verification is required.",
        },
        { status: 400 },
      );
    }
  }

  return getHandler().POST(request);
}
