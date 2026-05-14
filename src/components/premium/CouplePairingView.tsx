import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import {
  SADHANA_COUPLE_YEARLY_PRODUCT_ID,
  SADHANA_TIERS,
} from '../../billing/products';

export interface CouplePairingState {
  status: 'unpaired' | 'invited' | 'paired';
  partnerName?: string;
  inviteUrl?: string;
}

export interface CouplePairingViewProps {
  state: CouplePairingState;
  userId?: string | null;
  onPurchase?: (productId: string) => void;
  onSendInvite?: (inviteUrl: string) => void;
  onAcceptInvite?: (inviteUrl: string) => void;
  onUnpair?: () => void;
}

const UNIVERSAL_LINK_BASE = 'https://sadhana.app/couple/pair';

export function buildCoupleInviteUrl(
  inviterId: string,
  inviteCode: string
): string {
  const params = new URLSearchParams({
    inviter: inviterId,
    code: inviteCode,
  });
  return `${UNIVERSAL_LINK_BASE}?${params.toString()}`;
}

export function parseCoupleInviteUrl(
  rawUrl: string
): { inviterId: string; code: string } | null {
  try {
    const url = new URL(rawUrl);
    const inviter = url.searchParams.get('inviter');
    const code = url.searchParams.get('code');
    if (!inviter || !code) return null;
    return { inviterId: inviter, code };
  } catch {
    return null;
  }
}

export function CouplePairingView({
  state,
  userId,
  onPurchase,
  onSendInvite,
  onAcceptInvite,
  onUnpair,
}: CouplePairingViewProps) {
  const { tokens, spacing } = useTheme();
  const tier = SADHANA_TIERS.couple;

  const [pendingInviteUrl, setPendingInviteUrl] = useState<string | null>(
    state.inviteUrl ?? null
  );

  const handleGenerateInvite = async () => {
    const inviteCode = Math.random().toString(36).slice(2, 10);
    const inviter = userId ?? 'self';
    const url = buildCoupleInviteUrl(inviter, inviteCode);
    setPendingInviteUrl(url);
    onSendInvite?.(url);
    try {
      await Share.share({
        message: `A shared seat in Sadhana, held for you. ${url}`,
        url,
      });
    } catch {
      // Sharing is best-effort.
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: tokens.bgPrimary }]}
      edges={['top', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.eyebrow, { color: tokens.textSecondary }]}>
          Sadhana Couple
        </Text>
        <Text
          style={[
            styles.title,
            {
              color: tokens.textPrimary,
              fontFamily: tokens.fontFamilyHeading,
            },
          ]}
          accessibilityRole="header"
        >
          Two practitioners. One thread of intention.
        </Text>
        <Text
          style={[
            styles.lede,
            {
              color: tokens.textPrimary,
              fontFamily: fontFamilies.text.regular,
            },
          ]}
        >
          Sadhana Couple holds a year of practice for two. You each keep
          your own ladder. A shared dyad-of-intention sits between you —
          a place to set a common arc, return to it, and witness one
          another's steadiness.
        </Text>

        <View
          style={[
            styles.priceBox,
            {
              borderColor: tokens.border,
              backgroundColor: tokens.bgSecondary,
              marginTop: spacing.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.priceLine,
              {
                color: tokens.textPrimary,
                fontFamily: tokens.fontFamilyBodyStrong,
              },
            ]}
          >
            {tier.yearlyPrice} for the year. Held for two.
          </Text>
          <Text
            style={[
              styles.priceFoot,
              {
                color: tokens.textSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
          >
            The App Store confirms localized price and renewal terms before
            purchase.
          </Text>
        </View>

        {state.status === 'unpaired' ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={() => onPurchase?.(SADHANA_COUPLE_YEARLY_PRODUCT_ID)}
              style={({ pressed }) => [
                styles.primaryCta,
                {
                  backgroundColor: tokens.accent,
                  opacity: pressed ? 0.85 : 1,
                  marginTop: spacing.lg,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryCtaText,
                  {
                    color: tokens.bgPrimary,
                    fontFamily: tokens.fontFamilyBodyStrong,
                  },
                ]}
              >
                Begin the year
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleGenerateInvite}
              style={({ pressed }) => [
                styles.secondaryCta,
                {
                  borderColor: tokens.borderStrong,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryCtaText,
                  {
                    color: tokens.textPrimary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                Invite your partner first
              </Text>
            </Pressable>
          </>
        ) : null}

        {state.status === 'invited' && pendingInviteUrl ? (
          <View
            style={[
              styles.inviteBox,
              {
                borderColor: tokens.border,
                backgroundColor: tokens.bgSecondary,
                marginTop: spacing.lg,
              },
            ]}
          >
            <Text
              style={[
                styles.inviteLabel,
                {
                  color: tokens.textSecondary,
                  fontFamily: tokens.fontFamilyBody,
                },
              ]}
            >
              Invitation extended
            </Text>
            <Text
              style={[
                styles.inviteUrl,
                {
                  color: tokens.textPrimary,
                  fontFamily: tokens.fontFamilyBody,
                },
              ]}
              numberOfLines={2}
            >
              {pendingInviteUrl}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => onAcceptInvite?.(pendingInviteUrl)}
              style={({ pressed }) => [
                styles.secondaryCta,
                {
                  borderColor: tokens.borderStrong,
                  opacity: pressed ? 0.7 : 1,
                  marginTop: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryCtaText,
                  {
                    color: tokens.textPrimary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                Re-share invite
              </Text>
            </Pressable>
          </View>
        ) : null}

        {state.status === 'paired' ? (
          <View
            style={[
              styles.pairedBox,
              {
                borderColor: tokens.border,
                backgroundColor: tokens.bgSecondary,
                marginTop: spacing.lg,
              },
            ]}
          >
            <Text
              style={[
                styles.pairedTitle,
                {
                  color: tokens.textPrimary,
                  fontFamily: tokens.fontFamilyBodyStrong,
                },
              ]}
            >
              {state.partnerName
                ? `Paired with ${state.partnerName}.`
                : 'Paired with your partner.'}
            </Text>
            <Text
              style={[
                styles.pairedBody,
                {
                  color: tokens.textSecondary,
                  fontFamily: tokens.fontFamilyBody,
                },
              ]}
            >
              Your dyad-of-intention is ready in the Journal tab.
            </Text>
            {onUnpair ? (
              <Pressable
                accessibilityRole="button"
                onPress={onUnpair}
                style={styles.unpair}
              >
                <Text
                  style={[
                    styles.unpairText,
                    {
                      color: tokens.textSecondary,
                      fontFamily: tokens.fontFamilyBody,
                    },
                  ]}
                >
                  Unpair
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  lede: {
    fontSize: 15,
    lineHeight: 23,
  },
  priceBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  priceLine: {
    fontSize: 15,
    lineHeight: 22,
  },
  priceFoot: {
    fontSize: 12,
    lineHeight: 18,
  },
  primaryCta: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  secondaryCta: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryCtaText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  inviteBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  inviteLabel: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inviteUrl: {
    fontSize: 13,
    lineHeight: 19,
  },
  pairedBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  pairedTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  pairedBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  unpair: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  unpairText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
