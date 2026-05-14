import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import {
  SADHANA_GIFT_PRICE,
  SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID,
} from '../../billing/products';
import { purchaseSadhanaInAppProduct } from '../../billing/storeKit';

export interface GiftCompositionDraft {
  recipientName: string;
  note: string;
  productId: typeof SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID;
}

export interface GiftSadhanaViewProps {
  /**
   * Called after the StoreKit purchase resolves. If omitted, the view falls
   * back to invoking `purchaseSadhanaInAppProduct` directly and surfacing
   * errors silently.
   */
  onSend?: (draft: GiftCompositionDraft) => void | Promise<void>;
  onDismiss?: () => void;
  initialNote?: string;
}

const PLACEHOLDER_NOTE =
  'A few months of quiet practice, for whatever you are crossing.';

export function GiftSadhanaView({
  onSend,
  onDismiss,
  initialNote,
}: GiftSadhanaViewProps) {
  const { tokens, spacing } = useTheme();
  const [recipientName, setRecipientName] = useState('');
  const [note, setNote] = useState(initialNote ?? '');

  const [isPurchasing, setIsPurchasing] = useState(false);
  const canSend = recipientName.trim().length > 0 && !isPurchasing;

  const handleSend = async () => {
    if (!canSend) return;
    const draft: GiftCompositionDraft = {
      recipientName: recipientName.trim(),
      note: note.trim(),
      productId: SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID,
    };
    setIsPurchasing(true);
    try {
      if (onSend) {
        await onSend(draft);
      } else {
        await purchaseSadhanaInAppProduct(
          SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID
        );
      }
    } catch {
      // The parent flow is responsible for surfacing errors. Storefront
      // cancellations are silent by design.
    } finally {
      setIsPurchasing(false);
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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.eyebrow, { color: tokens.textSecondary }]}>
          Gift Sadhana
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
          Offer Sadhana to someone on a threshold.
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
          Three months of practice, sent quietly to one person. They redeem
          it through a link only they can open. No fanfare, no expiry while
          they wait.
        </Text>

        <View style={[styles.field, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.label,
              {
                color: tokens.textSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
          >
            Their name
          </Text>
          <TextInput
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="As they know themselves"
            placeholderTextColor={tokens.textMuted}
            style={[
              styles.input,
              {
                color: tokens.textPrimary,
                borderColor: tokens.border,
                backgroundColor: tokens.bgSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
            accessibilityLabel="Recipient name"
          />
        </View>

        <View style={[styles.field, { marginTop: spacing.md }]}>
          <Text
            style={[
              styles.label,
              {
                color: tokens.textSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
          >
            A short note
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={PLACEHOLDER_NOTE}
            placeholderTextColor={tokens.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.inputMultiline,
              {
                color: tokens.textPrimary,
                borderColor: tokens.border,
                backgroundColor: tokens.bgSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
            accessibilityLabel="Note to recipient"
          />
        </View>

        <View style={[styles.priceBlock, { marginTop: spacing.lg }]}>
          <Text
            style={[
              styles.priceLine,
              {
                color: tokens.textPrimary,
                fontFamily: tokens.fontFamilyBodyStrong,
              },
            ]}
          >
            {SADHANA_GIFT_PRICE} — three months, one recipient.
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
            The App Store confirms localized price and tax before purchase.
            Product ID: {SADHANA_GIFT_THREE_MONTHS_PRODUCT_ID}.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSend }}
          onPress={handleSend}
          disabled={!canSend}
          style={({ pressed }) => [
            styles.primaryCta,
            {
              backgroundColor: tokens.accent,
              opacity: !canSend ? 0.4 : pressed ? 0.85 : 1,
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
            {isPurchasing ? 'Confirming with the App Store' : 'Send the offering'}
          </Text>
        </Pressable>

        {onDismiss ? (
          <Pressable
            accessibilityRole="button"
            onPress={onDismiss}
            style={styles.dismiss}
          >
            <Text
              style={[
                styles.dismissText,
                {
                  color: tokens.textSecondary,
                  fontFamily: tokens.fontFamilyBody,
                },
              ]}
            >
              Not now
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
    marginBottom: 14,
  },
  lede: {
    fontSize: 15,
    lineHeight: 23,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    lineHeight: 21,
  },
  inputMultiline: {
    minHeight: 110,
  },
  priceBlock: {
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
  dismiss: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 6,
  },
  dismissText: {
    fontSize: 13,
  },
});
