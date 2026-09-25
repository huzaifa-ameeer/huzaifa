"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const EMAIL = "huzaifaameer098@gmail.com";
const PHONE = "+923188989545";
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  };

  return value.replace(/[&<>'"]/g, (character) => entities[character]);
}

function buildEmailHtml(
  name: string,
  email: string,
  title: string,
  message: string
) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTitle = escapeHtml(title);
  const formattedMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
      </head>
      <body style="margin:0;background:#f4f4f5;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="background:#18181b;padding:32px;color:#ffffff;">
                    <p style="margin:0 0 10px;color:#a1a1aa;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Portfolio inquiry</p>
                    <h1 style="margin:0;font-size:28px;line-height:1.25;">${safeTitle}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 24px;color:#52525b;font-size:16px;line-height:1.6;">You received a new message from your portfolio contact form.</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-collapse:collapse;">
                      <tr>
                        <td width="110" style="padding:12px 0;border-bottom:1px solid #f4f4f5;color:#71717a;font-size:14px;font-weight:700;vertical-align:top;">Sender</td>
                        <td style="padding:12px 0;border-bottom:1px solid #f4f4f5;color:#18181b;font-size:15px;line-height:1.5;vertical-align:top;">${safeName}<br /><span style="color:#71717a;font-size:13px;">${safeEmail}</span></td>
                      </tr>
                      <tr>
                        <td width="110" style="padding:12px 0;border-bottom:1px solid #f4f4f5;color:#71717a;font-size:14px;font-weight:700;vertical-align:top;">Subject</td>
                        <td style="padding:12px 0;border-bottom:1px solid #f4f4f5;color:#18181b;font-size:15px;line-height:1.5;vertical-align:top;">${safeTitle}</td>
                      </tr>
                    </table>
                    <div style="padding:20px;background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;color:#27272a;font-size:15px;line-height:1.7;">${formattedMessage}</div>
                    <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;line-height:1.5;">Sent from your portfolio contact form.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedTitle || !trimmedMessage) {
      toast.error("Please complete all fields.");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("The email service is not configured yet.");
      return;
    }

    setIsSubmitting(true);
    const sentAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: trimmedName,
          email: trimmedEmail,
          time: sentAt,
          to_email: EMAIL,
          from_name: trimmedName,
          from_email: trimmedEmail,
          reply_to: trimmedEmail,
          subject: trimmedTitle,
          message: trimmedMessage,
          html: buildEmailHtml(
            trimmedName,
            trimmedEmail,
            trimmedTitle,
            trimmedMessage
          ),
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setName("");
      setEmail("");
      setTitle("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Unable to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="w-full bg-white px-6 pb-20 pt-8 text-zinc-900 md:px-12 lg:px-20 dark:bg-black dark:text-white"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Contact
        </h2>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
          Have a project in mind? Let&apos;s talk.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">Email</h3>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 inline-block text-lg text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">Phone</h3>
              <a
                href={`tel:${PHONE.replace(/[^+\d]/g, "")}`}
                className="mt-1 inline-block text-lg text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              >
                {PHONE}
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            aria-busy={isSubmitting}
          >
            <input
              id="contact-name"
              name="from_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First Name"
              autoComplete="name"
              aria-label="Name"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-white"
            />
            <input
              id="contact-email"
              name="from_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              autoComplete="email"
              aria-label="Email address"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-white"
            />
            <input
              id="contact-title"
              name="subject"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subject or project title"
              aria-label="Subject or project title"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-white"
            />
            <textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              aria-label="Message"
              required
              disabled={isSubmitting}
              rows={5}
              className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:focus:border-white"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={`mt-2 flex w-fit items-center gap-2 rounded-lg border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-900 transition-colors disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-800 dark:text-white ${
                isSubmitting
                  ? ""
                  : "hover:border-zinc-500 hover:bg-zinc-200 dark:hover:border-white dark:hover:bg-zinc-800"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}