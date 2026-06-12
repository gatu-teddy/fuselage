import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditListingForm } from "@/components/listings/edit-listing-form";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: listing } = await supabase
    .from("listings")
    .select("*, images:listing_images(*)")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single();

  if (!listing) notFound();

  const images = ((listing.images ?? []) as { id: string; url: string; is_primary: boolean; position: number }[])
    .sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.position - b.position;
    });

  return <EditListingForm listing={listing} existingImages={images} />;
}
