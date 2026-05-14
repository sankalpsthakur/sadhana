# Sadhana Retreat Affiliate Program

The retreat partners surface inside Sadhana is an affiliate channel. The app
holds a small directory of partner centers; when a practitioner makes contact
through the app and books a stay, the partner returns a share of the booking
fee to Sadhana.

This document defines the commission, the tracking, and the payout model.

## Commission

| Term | Value |
|------|-------|
| Base commission | **15%** of the partner's pre-tax booking fee |
| Refunds and cancellations | Commission reverses 1:1 with the partner refund |
| Free or dāna-basis programs | No commission. Listing remains free of charge. |
| Renewals / repeat bookings | Commission applies only to the first booking that originated from a tracked Sadhana referral |

The 15% rate is held for the first cohort of three partners. We will revisit
once we have enough bookings to know what is fair for both sides. We have a
hard ceiling at 30% — beyond that the incentive structure begins to bend the
recommendation, which we are unwilling to allow.

## Tracking

Every "Inquire or book" tap opens the partner's URL with two query parameters
appended:

```
?ref=sadhana&user=<userId>
```

- `ref=sadhana` is the channel marker. Partners filter their booking funnel
  on this to attribute the inquiry to us.
- `user=<userId>` is the **anonymous Sadhana user identifier**, not an email
  or name. It allows the partner to confirm a booking back to us without
  exchanging PII. If the user has not consented to identifiable handoff,
  `user` is omitted entirely and only `ref=sadhana` is sent.

The construction is implemented in
`src/components/premium/RetreatPartnersView.tsx#buildPartnerInquiryUrl`.

A booking is attributed to Sadhana when:

1. The inquiry arrived with `ref=sadhana`, AND
2. The booking is confirmed within **90 days** of the first inquiry.

## Payout model

Partners are invoiced **quarterly**. Each invoice covers bookings that
completed (the stay was attended) during the prior quarter.

| Step | Owner | Cadence |
|------|-------|---------|
| Partner sends booking report (CSV with `ref`, booking ID, gross fee, date) | Partner | First week of each quarter |
| Sadhana reconciles against `ref` and `user` taps from app analytics | Sadhana | Within 2 weeks |
| Sadhana issues invoice to partner | Sadhana | End of reconciliation |
| Partner remits via bank transfer | Partner | Net-30 |

If a partner objects to a reconciliation line, the disputed line is set aside
and the rest is invoiced normally. Disputes are resolved within the next
quarterly cycle.

## Refunds and cancellations

If a booking is fully or partially refunded after Sadhana has been paid, the
amount owed is **netted against the next quarter's invoice**. A negative
balance carries forward indefinitely. We do not issue refund checks.

If the partner relationship is terminated with an outstanding negative
balance owed to the partner, Sadhana pays it within 30 days.

## What this is not

This is not a programmatic affiliate network. We do not list "any retreat
center that signs up." Listings are by relationship. Each partner is met
first by a human on the Sadhana team. The shape of the channel is closer to
a referral from a friend than a marketplace.

## Onboarding new partners

Real onboarding is a manual process. A new partner is added when:

1. A team member has visited or has a long-standing relationship with the
   center.
2. The center confirms in writing the 15% commission terms and the booking
   report cadence.
3. A booking page is configured to honor the `ref=sadhana` query parameter.

The three partners shown in `SAMPLE_RETREAT_PARTNERS` in
`RetreatPartnersView.tsx` are **placeholders** for the first cohort. They
will be replaced with real partner data — name, URL, dates, commission
confirmation — before this surface ships to production.

## User-facing disclosure

The view's lede includes the line:

> Inquire directly; we receive a small share when a stay is arranged, which
> we put back toward the work.

This is the entirety of the disclosure. It is not buried in fine print and
it is not framed as a sales-driven channel. Practitioners deserve to know
the incentive exists; they do not need a legal disclaimer.

## Internal contacts

- Affiliate ops: handled by the Sadhana team
- Reconciliation: handled by the Sadhana team
- Disputes: escalate to the Sadhana team

We will not list specific names here. When the program graduates beyond
three partners we will revisit ownership.
