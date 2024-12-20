import AppContainer from "@/app/app/_components/AppContainer/AppContainer";
import DataContainer from "@/app/app/_components/DataContainer/DataContainer";
import { getFeatureFlagServer } from "@/lib/utility/featureFlag";
import { notFound } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const showApp = await getFeatureFlagServer("show_app");
    return (
      <>
        <DataContainer>
          {showApp && <AppContainer>{children}</AppContainer>}
          {!showApp && (
            <>
              <h1>Meeple Party is currently invite-only</h1>
              <p>Please ask the administrator to unlock your account.</p>
            </>
          )}
        </DataContainer>
      </>
    );
  } catch {
    notFound();
  }
}
