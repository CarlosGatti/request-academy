"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select, Textarea } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  CreateDefinedAcademyPartnerDocument,
  DefinedAcademyPartnerStatus,
  DefinedAcademyPartnersAdminDocument,
  UpdateDefinedAcademyPartnerDocument,
  type DefinedAcademyPartnersAdminQuery,
} from "@/graphql/generated/graphql";
import { uploadPartnerLogo } from "@/lib/academy/uploads";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

type PartnerRow = DefinedAcademyPartnersAdminQuery["definedAcademyPartners"][number];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function PartnerEditForm({
  academyId,
  partner,
  onCancel,
  onSaved,
}: {
  academyId: number;
  partner: PartnerRow;
  onCancel: () => void;
  onSaved: () => Promise<unknown>;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(partner.name);
  const [slug, setSlug] = useState(partner.slug);
  const [description, setDescription] = useState(partner.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(partner.websiteUrl ?? "");
  const [contactUrl, setContactUrl] = useState(partner.contactUrl ?? "");
  const [location, setLocation] = useState(partner.location ?? "");
  const [logoUrl, setLogoUrl] = useState(partner.logoUrl ?? "");
  const [status, setStatus] = useState(partner.status ?? "DRAFT");
  const [featured, setFeatured] = useState(Boolean(partner.featured));
  const [error, setError] = useState<string | null>(null);
  const [updatePartner, { loading }] = useMutation(
    UpdateDefinedAcademyPartnerDocument,
  );

  return (
    <div className="space-y-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-accent/20">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-medium text-primary">
          Edit partner
        </h2>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Contact URL</Label>
          <Input
            value={contactUrl}
            onChange={(e) => setContactUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as DefinedAcademyPartnerStatus)
            }
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Logo</Label>
          <FileUploadButton
            accept="image/jpeg,image/png,image/webp"
            label="Upload logo"
            hint="JPEG/PNG/WebP · max 8MB. Updates partner logo automatically."
            onFile={async (file) => {
              try {
                setError(null);
                const result = await uploadPartnerLogo({
                  file,
                  academyId,
                  partnerId: partner.id,
                });
                setLogoUrl(result.url);
                toast("Partner logo uploaded", "success");
                await onSaved();
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Unable to upload partner logo.",
                );
              }
            }}
          />
          {logoUrl ? (
            <div className="relative mt-2 size-20 overflow-hidden border border-border bg-sea-foam p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Partner logo preview"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <p className="text-xs text-muted">No logo uploaded yet.</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={loading || !name.trim()}
          onClick={() => {
            setError(null);
            void updatePartner({
              variables: {
                academyId,
                partnerId: partner.id,
                input: {
                  name: name.trim(),
                  slug: slug.trim() || slugify(name),
                  description: description || undefined,
                  websiteUrl: websiteUrl || undefined,
                  contactUrl: contactUrl || undefined,
                  location: location || undefined,
                  status: status as DefinedAcademyPartnerStatus,
                  featured,
                },
              },
            })
              .then(async () => {
                toast("Partner updated", "success");
                await onSaved();
              })
              .catch((err) =>
                setError(
                  getGraphQLErrorMessage(err, "Unable to update partner."),
                ),
              );
          }}
        >
          {loading ? "Saving…" : "Save changes"}
        </Button>
        <Button size="md" variant="outline" onClick={onCancel}>
          Done
        </Button>
      </div>
    </div>
  );
}

export function AdminPartnersView() {
  const { academyId } = useAdminAcademy();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | string>("ALL");

  const partnersQuery = useQuery(DefinedAcademyPartnersAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const [createPartner, { loading }] = useMutation(
    CreateDefinedAcademyPartnerDocument,
  );
  const [updatePartner] = useMutation(UpdateDefinedAcademyPartnerDocument);

  const partners = partnersQuery.data?.definedAcademyPartners ?? [];
  const editingPartner =
    editingId == null
      ? null
      : (partners.find((partner) => partner.id === editingId) ?? null);

  const filteredPartners = useMemo(() => {
    const source = partnersQuery.data?.definedAcademyPartners ?? [];
    const query = search.trim().toLowerCase();
    return source.filter((partner) => {
      if (statusFilter !== "ALL" && (partner.status ?? "DRAFT") !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        partner.name.toLowerCase().includes(query) ||
        partner.slug.toLowerCase().includes(query) ||
        (partner.location ?? "").toLowerCase().includes(query) ||
        (partner.category?.name ?? "").toLowerCase().includes(query)
      );
    });
  }, [partnersQuery.data?.definedAcademyPartners, search, statusFilter]);

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage partners.</Alert>;
  }

  if (partnersQuery.loading && !partners.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Community"
        title="Partners"
        description="Professional network directory for this academy."
        actions={
          editingPartner ? null : (
            <Button variant="highlight" onClick={() => setShowForm((v) => !v)}>
              {showForm ? "Cancel" : "Add partner"}
            </Button>
          )
        }
      />

      {editingPartner ? (
        <PartnerEditForm
          key={editingPartner.id}
          academyId={academyId}
          partner={editingPartner}
          onCancel={() => setEditingId(null)}
          onSaved={() => partnersQuery.refetch()}
        />
      ) : showForm ? (
        <div className="space-y-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border/70">
          <h2 className="font-display text-lg font-medium text-primary">
            Add partner
          </h2>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partner-name">Name</Label>
              <Input
                id="partner-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(slugify(e.target.value));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-slug">Slug</Label>
              <Input
                id="partner-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="partner-website">Website</Label>
              <Input
                id="partner-website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="partner-description">Description</Label>
            <Textarea
              id="partner-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
          <Button
            disabled={loading || !name}
            onClick={() => {
              setError(null);
              void createPartner({
                variables: {
                  academyId,
                  input: {
                    name,
                    slug: slug || slugify(name),
                    description: description || undefined,
                    websiteUrl: websiteUrl || undefined,
                    featured,
                    status: "ACTIVE",
                  },
                },
              })
                .then(() => {
                  setName("");
                  setSlug("");
                  setDescription("");
                  setWebsiteUrl("");
                  setFeatured(false);
                  setShowForm(false);
                  return partnersQuery.refetch();
                })
                .catch((err) =>
                  setError(
                    getGraphQLErrorMessage(err, "Unable to create partner."),
                  ),
                );
            }}
          >
            {loading ? "Saving…" : "Create partner"}
          </Button>
        </div>
      ) : null}

      {partners.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/70 sm:flex-row">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="partner-search">Search</Label>
            <Input
              id="partner-search"
              placeholder="Search by name, location, or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2 sm:w-44">
            <Label htmlFor="partner-status">Status</Label>
            <Select
              id="partner-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
        </div>
      ) : null}

      {partners.length === 0 ? (
        <EmptyState
          title="No partners yet"
          description="Add organizations and professionals to the academy network directory."
          action={
            <Button variant="highlight" onClick={() => setShowForm(true)}>
              Add partner
            </Button>
          }
        />
      ) : filteredPartners.length === 0 ? (
        <EmptyState
          title="No matching partners"
          description="Try a different search or status filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredPartners.map((partner) => (
            <article
              key={partner.id}
              className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-sea-foam">
                  {partner.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logoUrl}
                      alt=""
                      className="h-full w-full object-contain p-0.5"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">
                      Logo
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-primary">{partner.name}</p>
                    <StatusBadge status={partner.status ?? "DRAFT"} />
                    {partner.featured ? (
                      <span className="text-xs font-medium text-highlight">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted">
                    {partner.category?.name
                      ? `${partner.category.name} · `
                      : ""}
                    {partner.location || "Region not set"}
                    {partner.websiteUrl ? ` · ${partner.websiteUrl}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={editingId === partner.id ? "primary" : "outline"}
                  onClick={() =>
                    setEditingId(editingId === partner.id ? null : partner.id)
                  }
                >
                  {editingId === partner.id ? "Editing" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    void updatePartner({
                      variables: {
                        academyId,
                        partnerId: partner.id,
                        input: { featured: !partner.featured },
                      },
                    }).then(() => partnersQuery.refetch())
                  }
                >
                  {partner.featured ? "Unfeature" : "Feature"}
                </Button>
                {partner.status !== "ARCHIVED" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      void updatePartner({
                        variables: {
                          academyId,
                          partnerId: partner.id,
                          input: { status: "ARCHIVED" },
                        },
                      }).then(() => partnersQuery.refetch())
                    }
                  >
                    Archive
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
