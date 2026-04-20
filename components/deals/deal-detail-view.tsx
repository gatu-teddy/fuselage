"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  DEAL_STATUS_LABELS, DEAL_STATUS_COLORS, type Deal, type DealStatus,
} from "@/lib/types";
import { formatUSD, formatDate, getInitials } from "@/lib/utils";
import { Send, Upload, CheckCircle, ChevronRight } from "lucide-react";

interface Props {
  deal: Deal & { messages: Array<{ id: string; message: string; created_at: string; sender_id: string; sender: { full_name: string; avatar_url?: string } }> };
  currentUserId: string;
  role: "buyer" | "seller";
}

const SELLER_NEXT_STATUSES: Partial<Record<DealStatus, DealStatus>> = {
  inquired: "negotiating",
  negotiating: "agreed",
  payment_uploaded: "payment_confirmed",
  payment_confirmed: "shipped",
  shipped: "delivered",
  delivered: "completed",
};

const SELLER_ACTION_LABELS: Partial<Record<DealStatus, string>> = {
  inquired: "Start negotiation",
  negotiating: "Mark as agreed",
  payment_uploaded: "Confirm payment received",
  payment_confirmed: "Mark as shipped",
  shipped: "Mark as delivered",
  delivered: "Mark as completed",
};

export function DealDetailView({ deal, currentUserId, role }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState(deal.agreed_price_usd?.toString() ?? "");
  const [trackingNumber, setTrackingNumber] = useState(deal.tracking_number ?? "");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [wireRef, setWireRef] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);

  const listing = deal.listing as Deal["listing"] & { images?: { url: string; is_primary: boolean }[] };
  const primaryImage = listing?.images?.find((i) => i.is_primary)?.url ?? listing?.images?.[0]?.url;
  const buyer = deal.buyer as { full_name: string; country: string; email: string; phone?: string };
  const seller = deal.seller as { company_name: string; city: string; profile: { full_name: string } };

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSendingMessage(true);
    const supabase = createClient();
    await supabase.from("deal_messages").insert({
      deal_id: deal.id,
      sender_id: currentUserId,
      message: message.trim(),
    });
    setMessage("");
    setSendingMessage(false);
    router.refresh();
  }

  async function advanceStatus() {
    const nextStatus = SELLER_NEXT_STATUSES[deal.status];
    if (!nextStatus) return;
    setUpdatingStatus(true);
    const supabase = createClient();
    const updatePayload: Record<string, unknown> = { status: nextStatus };
    if (nextStatus === "agreed" && agreedPrice) {
      updatePayload.agreed_price_usd = parseFloat(agreedPrice);
    }
    if (nextStatus === "shipped" && trackingNumber) {
      updatePayload.tracking_number = trackingNumber;
    }
    await supabase.from("deals").update(updatePayload).eq("id", deal.id);
    setUpdatingStatus(false);
    router.refresh();
  }

  async function uploadPaymentProof(e: React.FormEvent) {
    e.preventDefault();
    setUploadingProof(true);
    const supabase = createClient();
    await supabase.from("payment_proofs").insert({
      deal_id: deal.id,
      uploaded_by: currentUserId,
      file_url: "#placeholder",
      amount_usd: paymentAmount ? parseFloat(paymentAmount) : null,
      wire_reference: wireRef || null,
    });
    await supabase.from("deals").update({ status: "payment_uploaded" }).eq("id", deal.id);
    setUploadingProof(false);
    router.refresh();
  }

  const canAdvance = role === "seller" && !!SELLER_NEXT_STATUSES[deal.status];
  const isClosed = ["completed", "cancelled"].includes(deal.status);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            Deal · {formatDate(deal.created_at)}
          </div>
          <h1 className="text-xl font-bold">
            {listing?.year} {listing?.make} {listing?.model}
          </h1>
          <div className="text-sm text-muted-foreground mt-0.5">
            {deal.destination_country}{deal.destination_port ? ` · ${deal.destination_port}` : ""}
          </div>
        </div>
        <span className={`text-sm rounded-full px-3 py-1 font-medium ${DEAL_STATUS_COLORS[deal.status]}`}>
          {DEAL_STATUS_LABELS[deal.status]}
        </span>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {(["inquired", "negotiating", "agreed", "payment_uploaded", "payment_confirmed", "shipped", "delivered", "completed"] as DealStatus[]).map((s, i, arr) => {
          const statuses = ["inquired", "negotiating", "agreed", "payment_uploaded", "payment_confirmed", "shipped", "delivered", "completed"];
          const currentIdx = statuses.indexOf(deal.status);
          const stepIdx = statuses.indexOf(s);
          const done = stepIdx < currentIdx;
          const current = stepIdx === currentIdx;
          return (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className={`text-xs rounded-full px-2 py-0.5 ${done ? "bg-green-100 text-green-700" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {DEAL_STATUS_LABELS[s]}
              </div>
              {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main */}
        <div className="md:col-span-2 space-y-6">
          {/* Seller actions */}
          {role === "seller" && canAdvance && !isClosed && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Action required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deal.status === "negotiating" && (
                  <div className="space-y-1.5">
                    <Label>Agreed price (USD)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 82000"
                      value={agreedPrice}
                      onChange={(e) => setAgreedPrice(e.target.value)}
                    />
                  </div>
                )}
                {deal.status === "payment_confirmed" && (
                  <div className="space-y-1.5">
                    <Label>Tracking / Bill of lading number</Label>
                    <Input
                      placeholder="BL123456789"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={advanceStatus} disabled={updatingStatus} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {SELLER_ACTION_LABELS[deal.status]}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Buyer: upload payment proof */}
          {role === "buyer" && deal.status === "agreed" && (
            <Card className="border-gold-200 bg-gold-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Upload payment proof</CardTitle>
              </CardHeader>
              <form onSubmit={uploadPaymentProof}>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Wire your payment to the exporter and upload proof here. The deal will be tracked until delivery.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Amount sent (USD)</Label>
                      <Input
                        type="number"
                        placeholder={deal.agreed_price_usd?.toString()}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Wire transfer reference</Label>
                      <Input
                        placeholder="TXN-2026-XXXXX"
                        value={wireRef}
                        onChange={(e) => setWireRef(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={uploadingProof} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingProof ? "Uploading…" : "Confirm payment sent"}
                  </Button>
                </CardContent>
              </form>
            </Card>
          )}

          {/* Payment proofs */}
          {deal.payment_proofs && deal.payment_proofs.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Payment records</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {deal.payment_proofs.map((proof) => (
                  <div key={proof.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="text-sm font-medium">{proof.amount_usd ? formatUSD(proof.amount_usd) : "Amount not specified"}</div>
                      {proof.wire_reference && <div className="text-xs text-muted-foreground">Ref: {proof.wire_reference}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(proof.created_at)}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Messages */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Messages</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {deal.messages?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No messages yet.</p>
                )}
                {deal.messages?.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                        {getInitials(msg.sender?.full_name ?? "?")}
                      </div>
                      <div className={`rounded-lg px-3 py-2 max-w-xs text-sm ${isMine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <div>{msg.message}</div>
                        <div className={`text-xs mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatDate(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isClosed && (
                <form onSubmit={sendMessage} className="flex gap-2 pt-2 border-t">
                  <Textarea
                    placeholder="Send a message…"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 resize-none"
                  />
                  <Button type="submit" size="icon" disabled={sendingMessage || !message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Vehicle */}
          <Card>
            <CardContent className="p-4">
              {primaryImage && (
                <img src={primaryImage} alt="" className="w-full h-36 object-cover rounded-md mb-3" />
              )}
              <div className="text-sm font-semibold">{listing?.year} {listing?.make} {listing?.model}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{listing?.color}</div>
              {deal.agreed_price_usd && (
                <div className="mt-2 text-base font-bold text-primary">{formatUSD(deal.agreed_price_usd)}</div>
              )}
            </CardContent>
          </Card>

          {/* Parties */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Buyer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="font-medium">{buyer?.full_name}</div>
              <div className="text-muted-foreground">{buyer?.country}</div>
              {role === "seller" && buyer?.email && (
                <div className="text-muted-foreground text-xs">{buyer.email}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Exporter</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="font-medium">{seller?.company_name}</div>
              <div className="text-muted-foreground">{seller?.city}, UAE</div>
            </CardContent>
          </Card>

          {deal.tracking_number && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Shipment tracking</CardTitle></CardHeader>
              <CardContent>
                <div className="font-mono text-sm">{deal.tracking_number}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
