"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select, Textarea } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  DefinedAcademyAdminDocument,
  UpdateDefinedAcademyDocument,
} from "@/graphql/generated/graphql";
import { uploadAcademyLogo } from "@/lib/academy/uploads";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { reQuestTheme } from "@/lib/tenant/theme";

function readColors(settings: unknown) {
  if (!settings || typeof settings !== "object") return reQuestTheme.colors;
  const colors = (settings as { colors?: Record<string, string> }).colors;
  return {
    primary: colors?.primary || reQuestTheme.colors.primary,
    background: colors?.background || reQuestTheme.colors.background,
    secondary: colors?.secondary || reQuestTheme.colors.secondary,
    accent: colors?.accent || reQuestTheme.colors.accent,
    highlight: colors?.highlight || reQuestTheme.colors.highlight,
  };
}

function AcademySettingsForm({
  academyId,
  academy,
  onSaved,
}: {
  academyId: number;
  academy: {
    name: string;
    description?: string | null;
    logoUrl?: string | null;
    status: string;
    settings?: unknown;
    slug: string;
  };
  onSaved: () => Promise<unknown>;
}) {
  const { toast } = useToast();
  const colors = readColors(academy.settings);
  const [name, setName] = useState(academy.name);
  const [description, setDescription] = useState(academy.description ?? "");
  const [logoUrl, setLogoUrl] = useState(academy.logoUrl ?? "");
  const [status, setStatus] = useState(academy.status);
  const [primary, setPrimary] = useState(colors.primary);
  const [background, setBackground] = useState(colors.background);
  const [secondary, setSecondary] = useState(colors.secondary);
  const [accent, setAccent] = useState(colors.accent);
  const [highlight, setHighlight] = useState(colors.highlight);
  const [error, setError] = useState<string | null>(null);
  const [updateAcademy, { loading }] = useMutation(UpdateDefinedAcademyDocument);

  return (
    <div className="space-y-4 border border-border bg-surface p-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Logo</Label>
          <Input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://… or /uploads/…"
          />
          <FileUploadButton
            accept="image/jpeg,image/png,image/webp"
            label="Upload logo"
            hint="JPEG/PNG/WebP · max 8MB. Updates academy logo automatically."
            onFile={async (file) => {
              try {
                const result = await uploadAcademyLogo({
                  file,
                  academyId,
                });
                setLogoUrl(result.url);
                toast("Logo uploaded", "success");
                await onSaved();
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Unable to upload logo.",
                );
              }
            }}
          />
          {logoUrl ? (
            <div className="relative mt-2 h-16 w-48 overflow-hidden border border-border bg-primary p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Primary", primary, setPrimary],
            ["Background", background, setBackground],
            ["Secondary", secondary, setSecondary],
            ["Accent", accent, setAccent],
            ["Highlight", highlight, setHighlight],
          ] as const
        ).map(([label, value, setter]) => (
          <div key={label} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="color"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="h-10 p-1"
            />
          </div>
        ))}
      </div>
      <Button
        disabled={loading || !name}
        onClick={() => {
          setError(null);
          void updateAcademy({
            variables: {
              id: academyId,
              input: {
                name,
                description: description || undefined,
                logoUrl: logoUrl || undefined,
                status: status as "DRAFT" | "ACTIVE" | "ARCHIVED",
                settings: {
                  colors: {
                    primary,
                    background,
                    surface: "#FFFFFF",
                    secondary,
                    accent,
                    highlight,
                  },
                },
              },
            },
          })
            .then(async () => {
              toast("Academy settings saved", "success");
              await onSaved();
            })
            .catch((err) =>
              setError(getGraphQLErrorMessage(err, "Unable to save settings.")),
            );
        }}
      >
        {loading ? "Saving…" : "Save settings"}
      </Button>
      <p className="text-xs text-muted">Slug: {academy.slug}</p>
    </div>
  );
}

export function AdminSettingsView() {
  const { academyId } = useAdminAcademy();
  const academyQuery = useQuery(DefinedAcademyAdminDocument, {
    variables: { id: academyId ?? 0 },
    skip: !academyId,
  });

  if (!academyId) {
    return <Alert tone="warning">Select an academy to edit settings.</Alert>;
  }

  if (academyQuery.loading && !academyQuery.data) return <PageLoading />;

  const academy = academyQuery.data?.definedAcademy;
  if (!academy) {
    return <Alert tone="warning">Academy not found.</Alert>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Workspace branding and theme for the selected academy."
      />
      <AcademySettingsForm
        key={academy.id}
        academyId={academyId}
        academy={academy}
        onSaved={() => academyQuery.refetch()}
      />
    </div>
  );
}
