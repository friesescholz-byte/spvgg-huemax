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
