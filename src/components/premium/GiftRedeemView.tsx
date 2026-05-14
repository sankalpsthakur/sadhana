import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

export interface GiftRedeemPayload {
  giftId: string;
  senderName?: string;
  recipientName?: string;
  note?: string;
  monthsGranted?: number;
}

export interface GiftRedeemViewProps {
  payload: GiftRedeemPayload;
  onAccept?: (payload: GiftRedeemPayload) => void;
  onLater?: () => void;
}

export function parseGiftRedeemUrl(
  rawUrl: string
): GiftRedeemPayload | null {
  try {
    const url = new URL(rawUrl);
    const path = url.pathname.replace(/^\/+/, '').split('/');
    // Universal Link form: sadhana.app/gift/<giftId>?...
    const giftIdx = path.indexOf('gift');
    const giftId = giftIdx >= 0 ? path[giftIdx + 1] : null;
    if (!giftId) return null;
    const senderName = url.searchParams.get('from') ?? undefined;
    const recipientName = url.searchParams.get('to') ?? undefined;
    const note = url.searchParams.get('note') ?? undefined;
    const monthsParam = url.searchParams.get('months');
    const monthsGranted = monthsParam ? Number(monthsParam) : 3;
    return {
      giftId,
      senderName,
      recipientName,
      note,
      monthsGranted: Number.isFinite(monthsGranted) ? monthsGranted : 3,
    };
  } catch {
    return null;
  }
}

export function GiftRedeemView({
  payload,
  onAccept,
  onLater,
}: GiftRedeemViewProps) {
  const { tokens, spacing } = useTheme();
  const months = payload.monthsGranted ?? 3;

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
          An offering
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
          {payload.senderName
            ? `${payload.senderName} has offered you Sadhana.`
            : 'Someone has offered you Sadhana.'}
        </Text>
        {payload.note ? (
          <View
            style={[
              styles.noteBox,
              {
                borderColor: tokens.border,
                backgroundColor: tokens.bgSecondary,
                marginTop: spacing.md,
              },
            ]}
          >
            <Text
              style={[
                styles.noteText,
                {
                  color: tokens.textPrimary,
                  fontFamily: fontFamilies.text.regular,
                },
              ]}
            >
              &ldquo;{payload.note}&rdquo;
            </Text>
          </View>
        ) : null}

        <Text
          style={[
            styles.lede,
            {
              color: tokens.textPrimary,
              fontFamily: fontFamilies.text.regular,
              marginTop: spacing.lg,
            },
          ]}
        >
          {months} months of practice are held for you. There is nothing to
          buy and nothing to hurry. When you accept, the time begins.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => onAccept?.(payload)}
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
            Receive
          </Text>
        </Pressable>

        {onLater ? (
          <Pressable
            accessibilityRole="button"
            onPress={onLater}
            style={styles.later}
          >
            <Text
              style={[
                styles.laterText,
                {
                  color: tokens.textSecondary,
                  fontFamily: tokens.fontFamilyBody,
                },
              ]}
            >
              Hold this for another day
            </Text>
          </Pressable>
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
  },
  noteBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  lede: {
    fontSize: 15,
    lineHeight: 23,
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
  later: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  laterText: {
    fontSize: 13,
  },
});
