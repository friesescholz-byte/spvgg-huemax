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

    try {
      // GET /api/news - List all articles
      if (request.method === "GET" && path === "/api/news") {
        const list = await env.NEWS_KV.get("articles_list");
        return new Response(list || "[]", {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // POST /api/news - Create or update articles
      if (request.method === "POST" && path === "/api/news") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const body = await request.json();
        // Validate body
        if (!body || !Array.isArray(body)) {
          return new Response(JSON.stringify({ error: "Invalid articles list" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Save to KV
        await env.NEWS_KV.put("articles_list", JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // GET /api/birthdays - List all birthdays
      if (request.method === "GET" && path === "/api/birthdays") {
        const list = await env.NEWS_KV.get("birthdays_list");
        return new Response(list || "[]", {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // POST /api/birthdays - Save birthdays list
      if (request.method === "POST" && path === "/api/birthdays") {
        if (!checkAuth(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const body = await request.json();
        if (!body || !Array.isArray(body)) {
          return new Response(JSON.stringify({ error: "Invalid birthdays list" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        await env.NEWS_KV.put("birthdays_list", JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
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

        // 2. Verify Turnstile token with Cloudflare
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

        if (!turnstileResult.success) {
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
