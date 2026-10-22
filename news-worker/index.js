export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Helper to check admin password
    const checkAuth = (req) => {
      const token = req.headers.get("X-Admin-Token") || req.headers.get("Authorization");
      return token === env.ADMIN_PASSWORD;
    };

    const noCacheHeaders = {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    };

    try {
      // GET /api/news - List all articles
      if (request.method === "GET" && path === "/api/news") {
        const list = await env.NEWS_KV.get("articles_list");
        return new Response(list || "[]", {
          headers: noCacheHeaders
        });
      }

      // POST /api/news - Create or update articles
      if (request.method === "POST" && path === "/api/news") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: noCacheHeaders
          });
        }

        const body = await request.json();
        // Validate body
        if (!body || !Array.isArray(body)) {
          return new Response(JSON.stringify({ error: "Invalid articles list" }), {
            status: 400,
            headers: noCacheHeaders
          });
        }

        // Save to KV
        await env.NEWS_KV.put("articles_list", JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), {
          headers: noCacheHeaders
        });
      }

      // GET /api/birthdays - List all birthdays
      if (request.method === "GET" && path === "/api/birthdays") {
        const list = await env.NEWS_KV.get("birthdays_list");
        return new Response(list || "[]", {
          headers: noCacheHeaders
        });
      }

      // POST /api/birthdays - Save birthdays list
      if (request.method === "POST" && path === "/api/birthdays") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: noCacheHeaders
          });
        }

        const body = await request.json();
        if (!body || !Array.isArray(body)) {
          return new Response(JSON.stringify({ error: "Invalid birthdays list" }), {
            status: 400,
            headers: noCacheHeaders
          });
        }

        await env.NEWS_KV.put("birthdays_list", JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), {
          headers: noCacheHeaders
        });
      }

      // POST /api/verify-auth - Check if provided admin token is valid
      if (request.method === "POST" && path === "/api/verify-auth") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: noCacheHeaders
          });
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: noCacheHeaders
        });
      }

      // GET /api/ticker - Get current match and live ticker events (R2 strong consistency + KV fallback)
      if (request.method === "GET" && path === "/api/ticker") {
        let data = null;

        // 1. Try R2 first (Strongly consistent read-after-write globally, 0s delay)
        if (env.R2_BUCKET) {
          try {
            const r2Obj = await env.R2_BUCKET.get("spvgg-huemax/ticker.json");
            if (r2Obj) {
              data = await r2Obj.text();
            }
          } catch(e) {
            console.error("R2 read error:", e);
          }
        }

        // 2. Fallback to KV
        if (!data) {
          try {
            data = await env.NEWS_KV.get("ticker_data");
            if (data && env.R2_BUCKET) {
              // Auto-seed R2 so all subsequent reads are strongly consistent with 0s delay
              await env.R2_BUCKET.put("spvgg-huemax/ticker.json", data, {
                httpMetadata: {
                  contentType: "application/json",
                  cacheControl: "no-store, no-cache, must-revalidate, max-age=0"
                }
              }).catch(() => {});
            }
          } catch(e) {
            console.error("KV read error:", e);
          }
        }

        const defaultData = {
          match: {
            homeTeam: "SpVgg HüMax",
            awayTeam: "SV Bavenstedt II",
            homeLogo: "logo.png",
            awayLogo: "bavenstedt-logo.png",
            competition: "Kreisliga Hildesheim",
            matchDate: "Sonntag, 15:00 Uhr",
            location: "Sportplatz Machtsum (Rasen)",
            homeScore: 2,
            awayScore: 1,
            currentMinute: "73'",
            status: "second_half",
            statusText: "73' • 2. Halbzeit",
            isLive: true
          },
          events: [
            {
              id: "evt-4",
              minute: "72'",
              type: "sub",
              team: "home",
              title: "Wechsel bei SpVgg HüMax",
              description: "Applaus von den Rängen auf dem Machtsumer Sportplatz: Frische Kräfte für die Schlussphase.",
              player: "T. Meyer für L. Becker",
              score: "2:1",
              timestamp: "16:28"
            },
            {
              id: "evt-3",
              minute: "64'",
              type: "goal",
              team: "home",
              title: "TOOOOR für SpVgg HüMax!",
              description: "Was für eine Bude! Nach einer maßgeschneiderten Ecke steigt der Angreifer am Fünfmeterraum am höchsten und köpft unhaltbar ins lange Eck ein!",
              player: "M. Henke (Kopfball)",
              score: "2:1",
              timestamp: "16:19"
            },
            {
              id: "evt-2",
              minute: "41'",
              type: "goal",
              team: "away",
              title: "Tor für SV Bavenstedt II",
              description: "Ausgleich kurz vor der Pause. Ein strammer Flachschuss aus 16 Metern schlägt im linken unteren Toreck ein.",
              player: "D. Krause",
              score: "1:1",
              timestamp: "15:42"
            },
            {
              id: "evt-1",
              minute: "18'",
              type: "goal",
              team: "home",
              title: "TOOOOR für SpVgg HüMax!",
              description: "Traumstart für die Hausherren! Ballgewinn im Mittelfeld, schnelles Umschaltspiel und eiskalt vollstreckt.",
              player: "J. Brinkmann",
              score: "1:0",
              timestamp: "15:19"
            },
            {
              id: "evt-0",
              minute: "1'",
              type: "whistle",
              team: "neutral",
              title: "Anpfiff zur 1. Halbzeit",
              description: "Schiedsrichter pfeift die Partie bei bestem Fußballwetter auf dem Sportplatz Machtsum an.",
              player: "",
              score: "0:0",
              timestamp: "15:00"
            }
          ],
          archive: []
        };
        return new Response(data || JSON.stringify(defaultData), {
          headers: noCacheHeaders
        });
      }

      // POST /api/ticker - Update match or add/update ticker events (Saves to R2 + KV)
      if (request.method === "POST" && path === "/api/ticker") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: noCacheHeaders
          });
        }

        const body = await request.json();
        if (!body || !body.match || !Array.isArray(body.events)) {
          return new Response(JSON.stringify({ error: "Invalid ticker data structure" }), {
            status: 400,
            headers: noCacheHeaders
          });
        }

        const jsonStr = JSON.stringify(body);

        // 1. Save to R2 (Strong consistency globally, 0s propagation delay)
        if (env.R2_BUCKET) {
          try {
            await env.R2_BUCKET.put("spvgg-huemax/ticker.json", jsonStr, {
              httpMetadata: {
                contentType: "application/json",
                cacheControl: "no-store, no-cache, must-revalidate, max-age=0"
              }
            });
          } catch(e) {
            console.error("R2 put error:", e);
          }
        }

        // 2. Save to KV (Backup storage)
        await env.NEWS_KV.put("ticker_data", jsonStr);

        return new Response(JSON.stringify({ success: true, message: "Ticker erfolgreich aktualisiert" }), {
          headers: noCacheHeaders
        });
      }

      // POST /api/contact - Contact form with Turnstile validation & Resend email
      if (request.method === "POST" && path === "/api/contact") {
        const body = await request.json();
        const { vorname, nachname, email, nachricht, turnstileToken } = body;

        // 1. Validate required fields
        if (!vorname || !nachname || !email || !nachricht || !turnstileToken) {
          return new Response(JSON.stringify({ error: "Bitte fülle alle Pflichtfelder aus." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // 2. Verify Turnstile token with Cloudflare (supports mock-staging-token for preview/workers.dev)
        let isTurnstileValid = false;
        if (turnstileToken === "mock-staging-token") {
          isTurnstileValid = true;
        } else {
          try {
            const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: env.TURNSTILE_SECRET_KEY,
                response: turnstileToken,
                remoteip: request.headers.get("CF-Connecting-IP")
              })
            });
            const turnstileResult = await turnstileResponse.json();
            isTurnstileValid = !!turnstileResult.success;
          } catch (err) {
            console.error("Turnstile verification error:", err);
          }
        }

        if (!isTurnstileValid) {
          return new Response(JSON.stringify({ error: "Spam-Schutz-Validierung fehlgeschlagen. Bitte versuche es erneut." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // 3. Send email via Resend API
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Scholz & Friese Webdesign <noreply@scholz-friese-webdesign.de>",
            to: ["info@huemax.de"],
            subject: `[SpVgg HüMax] ⚽ Neue Kontaktanfrage von ${vorname} ${nachname}`,
            reply_to: email,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 2rem; border-radius: 12px;">
                <div style="background-color: #0a1c01; color: #ffffff; padding: 1.5rem 2rem; border-radius: 8px 8px 0 0; text-align: center;">
                  <h2 style="margin: 0; font-size: 1.4rem;">⚽ Neue Kontaktanfrage</h2>
                  <p style="margin: 0.5rem 0 0; opacity: 0.8; font-size: 0.9rem;">SpVgg Hüddessum/Machtsum e.V.</p>
                </div>
                <div style="background-color: #ffffff; padding: 2rem; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333; width: 120px;">Name:</td><td style="padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; color: #555;">${vorname} ${nachname}</td></tr>
                    <tr><td style="padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #333;">E-Mail:</td><td style="padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #153e02; font-weight: 600;">${email}</a></td></tr>
                  </table>
                  <div style="margin-top: 1.5rem; padding: 1.25rem; background-color: #f3f5ef; border-radius: 8px; border-left: 4px solid #e5b352;">
                    <p style="margin: 0 0 0.5rem; font-weight: bold; color: #333;">Nachricht:</p>
                    <p style="margin: 0; color: #555; white-space: pre-wrap; line-height: 1.6;">${nachricht}</p>
                  </div>
                </div>
                <p style="text-align: center; margin-top: 1.5rem; font-size: 0.8rem; color: #999;">Diese Nachricht wurde über das Kontaktformular auf spvgg-huemax.de gesendet.</p>
              </div>
            `
          })
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error("Resend API error:", emailResult);
          return new Response(JSON.stringify({ error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({ success: true, message: "Nachricht erfolgreich gesendet!" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Catch-all
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
