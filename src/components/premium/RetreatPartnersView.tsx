import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

export type RetreatType = 'silent' | 'guided' | 'family';

export interface RetreatPartner {
  id: string;
  name: string;
  location: string;
  dates: string;
  priceRange: string;
  retreatType: RetreatType;
  partnerUrl: string;
  description: string;
}

export const SAMPLE_RETREAT_PARTNERS: readonly RetreatPartner[] = [
  {
    id: 'vipassana-karnataka',
    name: 'Vipassana Sangha Karnataka',
    location: 'Bengaluru region, Karnataka',
    dates: '10-day courses, monthly cohorts',
    priceRange: 'Dāna basis (gift offering)',
    retreatType: 'silent',
    partnerUrl: 'https://example.org/partners/vipassana-karnataka',
    description:
      'Ten days of noble silence in the Goenka tradition. Bring only what is needed.',
  },
  {
    id: 'spirit-rock-ca',
    name: 'Spirit Rock',
    location: 'Woodacre, California',
    dates: 'Weekend and week-long retreats year-round',
    priceRange: '$420–$2,400 USD',
    retreatType: 'guided',
    partnerUrl: 'https://example.org/partners/spirit-rock',
    description:
      'Insight meditation in the West Marin hills. Guided sittings, dharma talks, walking practice.',
  },
  {
    id: 'plum-village-fr',
    name: 'Plum Village',
    location: 'Thénac, Dordogne, France',
    dates: 'Family retreats summer; weekly programs spring–autumn',
    priceRange: '€340–€980 EUR',
    retreatType: 'family',
    partnerUrl: 'https://example.org/partners/plum-village',
    description:
      'The community founded by Thich Nhat Hanh. Practice for adults and children together.',
  },
] as const;

const RETREAT_TYPE_LABEL: Record<RetreatType, string> = {
  silent: 'Silent',
  guided: 'Guided',
  family: 'Family',
};

export interface RetreatPartnersViewProps {
  partners?: readonly RetreatPartner[];
  userId?: string | null;
  onInquire?: (partner: RetreatPartner, trackedUrl: string) => void;
  onDismiss?: () => void;
}

export function buildPartnerInquiryUrl(
  partner: Pick<RetreatPartner, 'partnerUrl'>,
  userId?: string | null
): string {
  const baseUrl = partner.partnerUrl;
  const separator = baseUrl.includes('?') ? '&' : '?';
  const userParam = userId ? `&user=${encodeURIComponent(userId)}` : '';
  return `${baseUrl}${separator}ref=sadhana${userParam}`;
}

export function RetreatPartnersView({
  partners = SAMPLE_RETREAT_PARTNERS,
  userId,
  onInquire,
  onDismiss,
}: RetreatPartnersViewProps) {
  const { tokens, spacing } = useTheme();

  const handleInquire = (partner: RetreatPartner) => {
    const url = buildPartnerInquiryUrl(partner, userId);
    if (onInquire) {
      onInquire(partner, url);
      return;
    }
    Linking.openURL(url).catch(() => {});
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
        <Text
          style={[styles.eyebrow, { color: tokens.textSecondary }]}
        >
          Retreat Partners
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
          Places to sit, when it is time to leave the screen.
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
          These are partner retreat centers we have walked with. Each holds
          space in its own form. Inquire directly; we receive a small share
          when a stay is arranged, which we put back toward the work.
        </Text>

        <View style={[styles.partnerList, { marginTop: spacing.lg }]}>
          {partners.map((partner) => (
            <View
              key={partner.id}
              style={[
                styles.partner,
                {
                  borderColor: tokens.border,
                  backgroundColor: tokens.bgSecondary,
                },
              ]}
            >
              <View style={styles.partnerHeader}>
                <Text
                  style={[
                    styles.partnerName,
                    {
                      color: tokens.textPrimary,
                      fontFamily: tokens.fontFamilyBodyStrong,
                    },
                  ]}
                >
                  {partner.name}
                </Text>
                <View
                  style={[
                    styles.typeBadge,
                    { borderColor: tokens.borderStrong },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color: tokens.textSecondary,
                        fontFamily: tokens.fontFamilyBody,
                      },
                    ]}
                  >
                    {RETREAT_TYPE_LABEL[partner.retreatType]}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.partnerMeta,
                  {
                    color: tokens.textSecondary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                {partner.location}
              </Text>
              <Text
                style={[
                  styles.partnerMeta,
                  {
                    color: tokens.textSecondary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                {partner.dates}
              </Text>
              <Text
                style={[
                  styles.partnerMeta,
                  {
                    color: tokens.textSecondary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                {partner.priceRange}
              </Text>
              <Text
                style={[
                  styles.partnerDescription,
                  {
                    color: tokens.textPrimary,
                    fontFamily: tokens.fontFamilyBody,
                  },
                ]}
              >
                {partner.description}
              </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Inquire about ${partner.name}`}
                onPress={() => handleInquire(partner)}
                style={({ pressed }) => [
                  styles.inquireBtn,
                  {
                    borderColor: tokens.borderStrong,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.inquireText,
                    {
                      color: tokens.textPrimary,
                      fontFamily: tokens.fontFamilyBodyStrong,
                    },
                  ]}
                >
                  Inquire or book
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        {onDismiss ? (
          <Pressable
            accessibilityRole="button"
            onPress={onDismiss}
            style={[styles.dismiss, { marginTop: spacing.md }]}
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
              Return to practice
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  lede: {
    fontSize: 15,
    lineHeight: 23,
  },
  partnerList: {
    gap: 14,
  },
  partner: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    gap: 6,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 17,
    lineHeight: 22,
    flexShrink: 1,
    paddingRight: 8,
  },
  typeBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  partnerMeta: {
    fontSize: 13,
    lineHeight: 19,
  },
  partnerDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 12,
  },
  inquireBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inquireText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  dismiss: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dismissText: {
    fontSize: 13,
  },
});
