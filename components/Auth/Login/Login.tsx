/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Avatar from "@/components/Avatar/Avatar";
import { useUser } from "@/context/userContext";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Spinner from "../../../components/Spinner/Spinner";
import LoginButton from "../LoginButton/LoginButton";
import styles from "./login.module.css";

const Login: React.FC = () => {
  const { user, loading } = useUser();
  const { t } = useTranslation();
  return (
    <div className={classNames("card", styles.card)}>
      <div className="card-body d-flex align-items-center justify-content-center flex-column">
        {!loading && user && (
          <>
            <Avatar name={user.name || ""} image={user.image} />
            <strong>{user.name}</strong>
            {user.realName ? <small>{user.realName}</small> : <br />}
            <Link href="/app" className="btn btn-primary mt-2">
              {t("Login.GoToApp")} <i className="bi bi-arrow-right-circle"></i>
            </Link>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => signOut()}
            >
              {t("Login.Logout")} <i className="bi bi-door-open"></i>
            </button>
          </>
        )}
        {!loading && !user && <LoginButton />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Login;
