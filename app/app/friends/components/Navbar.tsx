import FriendRequestsBadge from "@/components/FriendRequests/FriendRequestsBadge/FriendRequestsBadge";
import {
    NavigationBar,
    NavigationItem,
} from "@/components/NavigationBar/NavigationBar";
import { getTranslation } from "@/i18n";

const Navbar: React.FC = async () => {
  const { t } = await getTranslation("friends");
  return (
    <NavigationBar>
      <NavigationItem href="/app/friends">
        {t("Navbar.Activity")}
      </NavigationItem>
      <NavigationItem href="/app/friends/requests">
        {t("Navbar.Requests")} &nbsp;
        <FriendRequestsBadge />
      </NavigationItem>
    </NavigationBar>
  );
};

export default Navbar;
