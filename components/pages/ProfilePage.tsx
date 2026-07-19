"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/auth-client";

export default function Infos() {
  const t = useTranslations("infos");

  const [editing, setEditing] = useState(false);
  const { data } = authClient.useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const handleEdit = () => {
    setName(data?.user.name ?? "");
    setPhone(data?.user.phone ?? "");
    setEditing(true);
  };

  const changeInfos = async () => {
    const { error } = await authClient.updateUser({
      name,

      phone,
    });

    if (error) {
      console.error(error);

      return;
    }

    setEditing(false);
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="p-3 text-center font-third text-[50px] text-white text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">
        {t("title")}
      </h1>

      <div className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-5 rounded-2xl border border-white/60 bg-border/40 p-6 shadow-lg backdrop-blur-sm sm:p-8">
        {/* NOM */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">{t("name")}</p>

          {editing ? (
            <input
              type="text"
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/50 bg-white/80 px-4 text-black outline-none"
            />
          ) : (
            <p className="text-lg text-white">{data?.user.name}</p>
          )}
        </div>

        {/* TELEPHONE */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">{t("phone")}</p>

          {editing ? (
            <input
              type="tel"
              value={phone}
              autoComplete="tel"
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-lg border border-white/50 bg-white/80 px-4 text-black outline-none"
            />
          ) : (
            <p className="text-lg text-white">{data?.user.phone}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">{t("mail")}</p>
          <p className="text-lg text-white">{data?.user.email}</p>
        </div>

        {editing ? (
          <button
            type="button"
            onClick={changeInfos}
            className="mt-4 h-11 rounded-lg bg-white px-5 font-medium text-black"
          >
            Enregistrer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleEdit}
            className="mt-4 h-11 rounded-lg bg-white px-5 font-medium text-black"
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
}
