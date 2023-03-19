/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from "@/context/userContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "../Avatar/Avatar";
import styles from "./topnav.module.css";

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <>
      {!!user && (
        <nav className={styles.menuBar}>
          <div className={styles.logo}>Meeple Party!</div>
          <ul className={styles.menu} style={{ marginBottom: 0 }}>
            <Link href="/app">
              <li className={pathname === "/app" ? styles.active : ""}>
                Dashboard
              </li>
            </Link>
            <Link href="/app/collection">
              <li
                className={
                  pathname?.startsWith("/app/collection") ? styles.active : ""
                }
              >
                Your Collection
              </li>
            </Link>
            <Link href="/app/friends">
              <li
                className={
                  pathname?.startsWith("/app/friends") ? styles.active : ""
                }
              >
                Friends
              </li>
            </Link>
          </ul>
          <div className={styles.user}>
            <div className={styles.avatar}>
              <Avatar image={user.image} name={!!user.name ? user.name : ""} />
            </div>
            <div className={styles.username}>{user.name}</div>
            <div className={styles.realname}>{user.realName}</div>
            <div className={styles.usermenu}>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      href={`/app/profile/${user.id}`}
                      className="dropdown-item"
                    >
                      Your profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a href="/api/auth/signout" className="dropdown-item">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}