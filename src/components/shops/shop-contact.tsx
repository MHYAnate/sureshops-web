"use client";

import { Phone, MessageCircle, Mail, Globe, Instagram, Facebook, Twitter, Copy } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { ContactDetails, BankDetails } from "@/types";
import toast from "react-hot-toast";

interface ShopContactProps {
  contactDetails: ContactDetails;
  bankDetails?: BankDetails;
}

export function ShopContact({ contactDetails, bankDetails }: ShopContactProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const copyBankDetails = () => {
    if (!bankDetails) return;
    const details = `Bank: ${bankDetails.bankName}\nAccount Name: ${bankDetails.accountName}\nAccount Number: ${bankDetails.accountNumber}`;
    navigator.clipboard.writeText(details);
    toast.success("Bank details copied!");
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Contact Information</h3>

      <div className="space-y-4">
        {/* Phone */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{contactDetails.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`tel:${contactDetails.phone}`)}
            >
              Call
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(contactDetails.phone, "Phone")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* WhatsApp */}
        {contactDetails.whatsapp && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WhatsApp</p>
                <p className="font-medium">{contactDetails.whatsapp}</p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() =>
                window.open(
                  `https://wa.me/${contactDetails.whatsapp?.replace(/\D/g, "")}`
                )
              }
            >
              Chat
            </Button>
          </div>
        )}

        {/* Email */}
        {contactDetails.email && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{contactDetails.email}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(`mailto:${contactDetails.email}`)}
            >
              Email
            </Button>
          </div>
        )}

        {/* Website */}
        {contactDetails.website && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium truncate max-w-[200px]">
                  {contactDetails.website}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(contactDetails.website, "_blank")}
            >
              Visit
            </Button>
          </div>
        )}

        {/* Social Links */}
        {(contactDetails.instagram || contactDetails.facebook || contactDetails.twitter) && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Social Media</p>
            <div className="flex gap-2">
              {contactDetails.instagram && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://instagram.com/${contactDetails.instagram}`,
                      "_blank"
                    )
                  }
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              )}
              {contactDetails.facebook && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://facebook.com/${contactDetails.facebook}`,
                      "_blank"
                    )
                  }
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              )}
              {contactDetails.twitter && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/${contactDetails.twitter}`,
                      "_blank"
                    )
                  }
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Bank Details */}
        {bankDetails && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">Bank Details for Transfer</p>
              <Button size="sm" variant="outline" onClick={copyBankDetails}>
                <Copy className="mr-2 h-4 w-4" />
                Copy All
              </Button>
            </div>
            <div className="space-y-2 text-sm bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank</span>
                <span className="font-medium">{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name</span>
                <span className="font-medium">{bankDetails.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono font-medium">{bankDetails.accountNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}