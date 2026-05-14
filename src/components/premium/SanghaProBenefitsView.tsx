import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import {
  SADHANA_TIERS,
  SADHANA_SANGHA_MONTHLY_PRODUCT_ID,
  SADHANA_SANGHA_YEARLY_PRODUCT_ID,
  type SadhanaSubscriptionProductId,
} from '../../billing/products';

export interface SanghaProBenefitsViewProps {
  onContinue?: (productId: SadhanaSubscriptionProductId) => void;
  onDismiss?: () => void;
}

interface Benefit {
  title: string;
  body: string;
}

const BENEFITS: readonly Benefit[] = [
  {
    title: 'A monthly recorded teaching',
    body:
      '10 to 15 minutes of audio offered each month — a guidance on a single thread of practice. Stored in your library to return to.',
  },
  {
    title: 'A quarterly group sitting',
    body:
      'Once a quarter the Sadhana team holds a live Q&A over Zoom. The link is offered ahead of time; sessions are recorded for those who cannot attend.',
  },
  {
    title: 'Transcripts library',
    body:
      'Every recorded teaching is transcribed and indexed. Read at a pace that lets the meaning settle.',
  },
  {
    title: 'Priority correspondence',
    body:
      'Letters sent to the Sadhana team are read first. We answer with care, not haste.',
  },
];

const PLAN_LABEL: Record<SadhanaSubscriptionProductId, string> = {
  'com.sadhana.premium.monthly': '',
  'com.sadhana.premium.annual': '',
  'com.sankalpsthakur.sadhana.sangha.monthly': 'Monthly',
  'com.sankalpsthakur.sadhana.sangha.yearly': 'Yearly',
  'com.sankalpsthakur.sadhana.couple.yearly': '',
};

export function SanghaProBenefitsView({
  onContinue,
  onDismiss,
}: SanghaProBenefitsViewProps) {
  const { tokens, spacing } = useTheme();
  const tier = SADHANA_TIERS['sangha-pro'];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: tokens.bgPrimary }]}
      edges={['top', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.eyebrow,
            { color: tokens.textSecondary },
          ]}
        >
          Sangha Pro
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
          A closer thread to the teaching.
        </Text>
        <Text
          style={[
            styles.lede,
            { color: tokens.textPrimary, fontFamily: fontFamilies.text.regular },
          ]}
        >
          Sangha Pro is for practitioners who wish to stay in steady
          correspondence with the work and with the people behind it. It is
          not a louder version of the app. It is a quieter one.
        </Text>

        <View style={[styles.benefitList, { marginTop: spacing.lg }]}>
          {BENEFITS.map((benefit) => (
            <View
              key={benefit.title}
              style={[
                styles.benefit,
                {
                  borderColor: tokens.border,
                  backgroundColor: tokens.bgSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.benefitTitle,
                  {
                    color: tokens.textPrimary,
                    fontFamily: tokens.fontFamilyBodyStrong,
                  },
                ]}
              >
                {benefit.title}
              </Text>
              <Text
                style={[
                  styles.benefitBody,
                  {
                    color: tokens.textSecondary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                {benefit.body}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.priceBlock}>
          <Text
            style={[
              styles.priceLine,
              {
                color: tokens.textPrimary,
                fontFamily: tokens.fontFamilyBodyStrong,
              },
            ]}
          >
            {tier.monthlyPrice} each month, or {tier.yearlyPrice} held for a
            year.
          </Text>
          <Text
            style={[
              styles.priceFootnote,
              {
                color: tokens.textSecondary,
                fontFamily: tokens.fontFamilyBody,
              },
            ]}
          >
            The App Store confirms localized price, tax, and renewal terms
            before purchase.
          </Text>
        </View>

        <View style={[styles.ctaColumn, { marginTop: spacing.lg }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              onContinue?.(SADHANA_SANGHA_YEARLY_PRODUCT_ID)
            }
            style={({ pressed }) => [
              styles.primaryCta,
              {
                backgroundColor: tokens.accent,
                opacity: pressed ? 0.85 : 1,
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
              Continue with the yearly rate
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              onContinue?.(SADHANA_SANGHA_MONTHLY_PRODUCT_ID)
            }
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
              Continue month to month
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export const _SANGHA_PRO_PLAN_LABEL = PLAN_LABEL;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 32,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  lede: {
    fontSize: 16,
    lineHeight: 24,
  },
  benefitList: {
    gap: 12,
  },
  benefit: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  benefitBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  priceBlock: {
    marginTop: 24,
    gap: 6,
  },
  priceLine: {
    fontSize: 15,
    lineHeight: 22,
  },
  priceFootnote: {
    fontSize: 12,
    lineHeight: 18,
  },
  ctaColumn: {
    gap: 10,
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
  },
  secondaryCtaText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dismissText: {
    fontSize: 13,
  },
});
