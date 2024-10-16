"use client";

import useUserProfile from "@/hooks/useUserProfile";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import FriendRequestsBadge from "../FriendRequests/FriendRequestsBadge/FriendRequestsBadge";
import Logo from "../Logo/Logo";
import Person from "../Person/Person";
import styles from "./topnav.module.css";

export default function TopNav() {
  const pathname = usePathname();
  const { userProfile } = useUserProfile();
  const router = useRouter();
  const { t } = useTranslation();

  const logout = useCallback(() => {
    signOut({ redirect: false })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [router]);

  if (userProfile) {
    return (
      <nav className="navbar navbar-expand-md bg-primary-subtle shadow-sm">
        <div className="container-fluid">
          <Logo size="md" unstyled className="navbar-brand" />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label={t("Navigation.Toggle")}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                className={classNames("nav-item", {
                  active: pathname === "/app",
                })}
              >
                <Link href="/app" className="nav-link">
                  {t("Navigation.Pages.Dashboard")}
                </Link>
              </li>
              <li
                className={classNames("nav-item", {
                  active: pathname?.startsWith("/app/collection"),
                })}
              >
                <Link href="/app/collection" className="nav-link">
                  {t("Navigation.Pages.Collection")}
                </Link>
              </li>
              <li
                className={classNames("nav-item", {
                  active: pathname?.startsWith("/app/friends"),
                })}
              >
                <Link href="/app/friends" className="nav-link">
                  {t("Navigation.Pages.Friends")}&nbsp; <FriendRequestsBadge />
                </Link>
              </li>
            </ul>
            <div className={classNames("d-flex", styles.user)}>
              <Person
                name={userProfile.name!}
                image={userProfile.image || undefined}
                realName={userProfile.realName || undefined}
              />
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      href={`/app/profile/${userProfile.id}`}
                      className="dropdown-item"
                    >
                      {t("Navigation.Menu.Profile")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/app/profile/edit/settings"}
                      className="dropdown-item"
                    >
                      {t("Navigation.Menu.Settings")}
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={logout} className="dropdown-item">
                      {t("Login.Logout")}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  } else {
    return <></>;
  }
}
