import { createClient } from "npm:@supabase/supabase-js@2";

type ContactRequestPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company_name?: unknown;
  service_interest?: unknown;
  message?: unknown;
  accepted_whatsapp_contact?: unknown;
};

const allowedOrigins = new Set([
  "https://bcsolucionesdigitales.com",
  "http://localhost:5173",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = allowedOrigins.has(origin)
    ? origin
    : "https://bcsolucionesdigitales.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(req: Request, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      "Content-Type": "application/json",
    },
  });
}

function asOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validatePayload(payload: ContactRequestPayload) {
  const name = asOptionalString(payload.name);
  const email = asOptionalString(payload.email);
  const phone = asOptionalString(payload.phone);
  const companyName = asOptionalString(payload.company_name);
  const serviceInterest = asOptionalString(payload.service_interest);
  const message = asOptionalString(payload.message);

  const errors: Record<string, string> = {};

  if (!name || name.length < 2) {
    errors.name = "El nombre es obligatorio y debe tener al menos 2 caracteres.";
  }

  if (!message || message.length < 5) {
    errors.message = "El mensaje es obligatorio y debe tener al menos 5 caracteres.";
  }

  if (email && !emailPattern.test(email)) {
    errors.email = "El correo no tiene un formato valido.";
  }

  if (typeof payload.accepted_whatsapp_contact !== "boolean") {
    errors.accepted_whatsapp_contact = "accepted_whatsapp_contact debe ser boolean.";
  }

  return {
    data: {
      name,
      email,
      phone,
      company_name: companyName,
      service_interest: serviceInterest,
      message,
      accepted_whatsapp_contact: payload.accepted_whatsapp_contact,
    },
    errors,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return jsonResponse(req, 405, {
      success: false,
      error: "method_not_allowed",
    });
  }

  let payload: ContactRequestPayload;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse(req, 400, {
      success: false,
      error: "invalid_json",
    });
  }

  const { data, errors } = validatePayload(payload);

  if (Object.keys(errors).length > 0) {
    return jsonResponse(req, 400, {
      success: false,
      error: "validation_failed",
      fields: errors,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(req, 500, {
      success: false,
      error: "server_not_configured",
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const userAgent = req.headers.get("user-agent");
  const origin = req.headers.get("origin");

  try {
    const { data: organization, error: organizationError } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", "byc")
      .single();

    if (organizationError || !organization) {
      return jsonResponse(req, 500, {
        success: false,
        error: "organization_not_found",
      });
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        organization_id: organization.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        service_interest: data.service_interest,
        source: "web_form",
        status: "new",
        metadata: {
          origin: "landing_contact_form",
        },
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      return jsonResponse(req, 500, {
        success: false,
        error: "lead_create_failed",
      });
    }

    const contactRequestMetadata: Record<string, unknown> = {
      origin: "landing_contact_form",
    };

    if (userAgent) {
      contactRequestMetadata.user_agent = userAgent;
    }

    if (origin) {
      contactRequestMetadata.request_origin = origin;
    }

    const { data: contactRequest, error: contactRequestError } = await supabase
      .from("contact_requests")
      .insert({
        organization_id: organization.id,
        lead_id: lead.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        service_interest: data.service_interest,
        message: data.message,
        accepted_whatsapp_contact: data.accepted_whatsapp_contact,
        status: "new",
        source: "web_form",
        metadata: contactRequestMetadata,
      })
      .select("id")
      .single();

    if (contactRequestError || !contactRequest) {
      return jsonResponse(req, 500, {
        success: false,
        error: "contact_request_create_failed",
      });
    }

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        organization_id: organization.id,
        lead_id: lead.id,
        channel: "web_form",
        status: "open",
        metadata: {
          origin: "landing_contact_form",
        },
      })
      .select("id")
      .single();

    if (conversationError || !conversation) {
      return jsonResponse(req, 500, {
        success: false,
        error: "conversation_create_failed",
      });
    }

    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        role: "user",
        direction: "inbound",
        content: data.message,
        metadata: {
          origin: "landing_contact_form",
          service_interest: data.service_interest,
        },
      });

    if (messageError) {
      return jsonResponse(req, 500, {
        success: false,
        error: "message_create_failed",
      });
    }

    return jsonResponse(req, 200, {
      success: true,
      lead_id: lead.id,
      contact_request_id: contactRequest.id,
      conversation_id: conversation.id,
    });
  } catch {
    return jsonResponse(req, 500, {
      success: false,
      error: "unexpected_server_error",
    });
  }
});
