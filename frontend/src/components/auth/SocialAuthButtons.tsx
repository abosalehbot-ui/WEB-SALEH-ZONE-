"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

import { useUserStore } from "@/store/useUserStore";

type GoogleCredentialResponse = {
  credential?: string;
};

type TelegramWidgetPayload = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
    salehTelegramAuth?: (user: TelegramWidgetPayload) => void;
  }
}

export function SocialAuthButtons() {
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle);
  const loginWithTelegram = useUserStore((state) => state.loginWithTelegram);
  const isLoading = useUserStore((state) => state.isLoading);
  const [error, setError] = useState("");
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isTelegramReady, setIsTelegramReady] = useState(false);
  const googleContainerRef = useRef<HTMLDivElement | null>(null);
  const telegramContainerRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  const canRenderGoogle = useMemo(() => Boolean(googleClientId), [googleClientId]);
  const canRenderTelegram = useMemo(() => Boolean(telegramBotUsername), [telegramBotUsername]);

  useEffect(() => {
    if (!canRenderGoogle || !isGoogleReady || !googleContainerRef.current || !window.google?.accounts?.id) {
      return;
    }

    const onGoogleSuccess = async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        setError("Google credential missing");
        return;
      }

      try {
        setError("");
        await loginWithGoogle(response.credential);
        window.location.href = "/";
      } catch {
        setError("Google login failed");
      }
    };

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: onGoogleSuccess
    });

    googleContainerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleContainerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 320
    });
  }, [canRenderGoogle, googleClientId, isGoogleReady, loginWithGoogle]);

  useEffect(() => {
    if (!canRenderTelegram || !isTelegramReady || !telegramContainerRef.current || !telegramBotUsername) {
      return;
    }

    window.salehTelegramAuth = async (user: TelegramWidgetPayload) => {
      try {
        setError("");
        await loginWithTelegram(user);
        window.location.href = "/";
      } catch {
        setError("Telegram login failed");
      }
    };

    telegramContainerRef.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", telegramBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "salehTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    telegramContainerRef.current.appendChild(script);

    return () => {
      delete window.salehTelegramAuth;
    };
  }, [canRenderTelegram, isTelegramReady, loginWithTelegram, telegramBotUsername]);

  return (
    <div className="space-y-3">
      {canRenderGoogle ? (
        <>
          <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setIsGoogleReady(true)} />
          <div ref={googleContainerRef} className="flex justify-center" />
        </>
      ) : (
        <p className="text-xs text-saleh-textMuted">Google login is not configured.</p>
      )}

      {canRenderTelegram ? (
        <>
          <Script id="telegram-widget-loader" src="https://telegram.org/js/telegram-widget.js?22" strategy="afterInteractive" onLoad={() => setIsTelegramReady(true)} />
          <div ref={telegramContainerRef} className="flex justify-center" />
        </>
      ) : (
        <p className="text-xs text-saleh-textMuted">Telegram login is not configured.</p>
      )}

      {isLoading && <p className="text-xs text-saleh-textMuted">Signing you in...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
