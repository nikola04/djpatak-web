"use client";
import { FormEvent, useEffect, useState } from "react";
import NavProfileMenu from "./ProfileMenu";
import DiscordButton from "../discord/DiscordSignIn";
import { useRouter, useSearchParams } from "next/navigation";
import apiRequest, { ResponseDataType } from "@/utils/apiRequest";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/Auth";
import { userSignOut } from "@/utils/user";
import { useAlert } from "../providers/Alert";

export type ProfileLink = {
  name: string;
  href: string;
  func: (() => void) | null;
  chevron: boolean;
};

export default function Nav({
  guildId,
}: Readonly<{
  guildId: string | null;
}>) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [inputVal, setInputVal] = useState("");
  const router = useRouter();
  const { pushAlert } = useAlert();
  const { logout } = useAuth();

  const signOut = async () => {
    try {
      await userSignOut();
      logout();
      router.push("/?logout=1");
    } catch (err) {
      pushAlert(String(err));
    }
  };

  const profileLinks: ProfileLink[] = [
    {
      name: "Settings",
      href: "/account/settings",
      func: null,
      chevron: true,
    },
    {
      name: "Logout",
      href: "/account/logout",
      func: signOut,
      chevron: false,
    },
  ];

  const searchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputVal.length <= 2) return;
    router.push(
      `/player/${guildId}/search?query=${encodeURIComponent(inputVal)}`,
    );
  };
  return (
    <nav
      className="px-4 flex justify-between items-center"
      style={{ height: "64px" }}
    >
      {guildId ? (
        <form onSubmit={(e) => searchSubmit(e)} className="my-2">
          <div className="relative w-80 flex items-center">
            <input
              onChange={(e) => setInputVal(e.target.value)}
              defaultValue={query ? query : ""}
              placeholder="Search..."
              type="text"
              name="query"
              style={{ height: "42px" }}
              className="w-full px-3 pr-[38px] border border-transparent outline-0 items-center text-white-gray text-sm bg-blue-dark rounded-md focus:border-blue-light hover:border-blue-light transition-all duration-200"
            />
            <button
              title="Search"
              type="submit"
              className="z-10 absolute right-[8px]"
            >
              <svg
                style={{ filter: "drop-shadow(0 0 1px #111)" }}
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="text-white-gray text-2xl"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <div></div>
      )}
      <div className="flex items-center">
        <ProfileMenu profileLinks={profileLinks} />
      </div>
    </nav>
  );
}

export function NavLogo() {
  return (
    <div className="flex w-full h-full items-center justify-center px-4">
      <Link href="/" title="Home">
        <span>
          <div className="flex items-center">
            <Image
              src={"/logo-text.png"}
              alt="DjPatak"
              width={144}
              height={36}
            />
          </div>
        </span>
      </Link>
    </div>
  );
}

function ProfileMenu({ profileLinks }: { profileLinks: ProfileLink[] }) {
  const { user, loading } = useAuth();
  if (loading) return <ProfileSceleton />;
  if (user) return <NavProfileMenu user={user} profileLinks={profileLinks} />;
  return (
    <DiscordButton
      onClick={() => window.open(process.env.NEXT_PUBLIC_DISCORD_LOGIN_URL)}
    />
  );
}

function ProfileSceleton() {
  return (
    <div className="px-2">
      <div className="animate-pulse rounded-full w-9 h-9 bg-black-light"></div>
    </div>
  );
}
