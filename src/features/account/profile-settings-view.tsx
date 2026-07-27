"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileAvatarUpload } from "@/features/account/profile-avatar-upload";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import {
  MeDocument,
  UpdateUserDocument,
} from "@/graphql/generated/graphql";
import { useAuth, type AuthUser } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

function toLocalUser(user: {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
  apps?: string[] | null;
  isAdmin?: boolean | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    // Nest `updateUser` currently treats null as "omit"; empty string clears.
    profilePicture: user.profilePicture?.trim() || null,
    isAdmin: user.isAdmin ?? false,
    apps: user.apps ?? [],
  };
}

export function ProfileSettingsView() {
  const router = useRouter();
  const { token, user, updateUser, clearSession, isAuthenticated } = useAuth();
  const { data, error: meError, refetch } = useQuery(MeDocument, {
    skip: !token,
    fetchPolicy: "cache-and-network",
  });
  const [updateUserMutation] = useMutation(UpdateUserDocument);

  const me = data?.me;
  const displayUser = me
    ? toLocalUser(me)
    : user;

  useEffect(() => {
    if (me) {
      updateUser(toLocalUser(me));
    }
  }, [me, updateUser]);

  if (!isAuthenticated || !token) {
    return (
      <Alert tone="danger">Sign in to manage your profile photo.</Alert>
    );
  }

  const displayName = [displayUser?.firstName, displayUser?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Update your photo. It appears in your workspace header and across RE-Quest Academy."
        breadcrumbs={[
          { label: "Workspace", href: "/workspace" },
          { label: "Profile" },
        ]}
      />

      {meError ? (
        <Alert tone="danger">
          {getGraphQLErrorMessage(meError, "Could not load your profile.")}
        </Alert>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-medium text-primary">
          Profile photo
        </h2>
        <ProfileAvatarUpload
          token={token}
          profilePicture={displayUser?.profilePicture}
          displayName={displayName || displayUser?.email}
          firstName={displayUser?.firstName}
          lastName={displayUser?.lastName}
          email={displayUser?.email}
          onUpdated={(profilePicture) => {
            if (!displayUser) return;
            updateUser({ ...displayUser, profilePicture });
          }}
          onSave={async (profilePicture) => {
            try {
              // Backend maps `null ?? undefined` and skips the field; send "" to clear.
              const result = await updateUserMutation({
                variables: {
                  data: {
                    profilePicture:
                      profilePicture === null ? "" : profilePicture,
                  },
                },
              });
              const updated = result.data?.updateUser;
              if (updated && displayUser) {
                // updateUser returns Prisma User — apps is a relation there, not [String].
                // Keep existing apps from auth/me; only merge profile fields.
                updateUser(
                  toLocalUser({
                    ...displayUser,
                    ...updated,
                    apps: displayUser.apps,
                  }),
                );
              }
              await refetch();
            } catch (err) {
              const message = getGraphQLErrorMessage(
                err,
                "Could not save profile photo.",
              );
              if (
                message.toLowerCase().includes("unauthorized") ||
                message.toLowerCase().includes("unauthenticated")
              ) {
                clearSession();
                router.push("/login?returnUrl=/workspace/settings");
              }
              throw err instanceof Error ? err : new Error(message);
            }
          }}
        />
      </section>

      <section className="space-y-1 border-t border-border pt-6">
        <h2 className="font-display text-lg font-medium text-primary">
          Account
        </h2>
        <p className="text-sm text-muted">
          Signed in as{" "}
          <span className="font-medium text-primary">
            {displayUser?.email}
          </span>
          {displayName ? (
            <>
              {" "}
              ({displayName})
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
