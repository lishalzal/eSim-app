import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { UserESIMsService, PlansService } from '../services/firebase';
import { UserESIM, ESIMPlan, RootStackParamList } from '../types';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../constants';
import { formatCurrency, formatDataUsage, formatTimeRemaining, getInitials } from '../utils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [userESIMs, setUserESIMs] = useState<UserESIM[]>([]);
  const [popularPlans, setPopularPlans] = useState<ESIMPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user) {
        const [esims, plans] = await Promise.all([
          UserESIMsService.getUserESIMs(user.id),
          PlansService.getPopularPlans(),
        ]);
        setUserESIMs(esims);
        setPopularPlans(plans);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const getActiveESIMs = () => {
    return userESIMs.filter(esim => esim.status === 'active');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Explore')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="globe" size={24} color={COLORS.surface} />
          </View>
          <Text style={styles.quickActionText}>Explore Plans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('MyESIMs')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
            <Ionicons name="card" size={24} color={COLORS.surface} />
          </View>
          <Text style={styles.quickActionText}>My eSIMs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent }]}>
            <Ionicons name="person" size={24} color={COLORS.surface} />
          </View>
          <Text style={styles.quickActionText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActiveESIMs = () => {
    const activeESIMs = getActiveESIMs();
    
    if (activeESIMs.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active eSIMs</Text>
          <Card>
            <CardBody>
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyStateTitle}>No Active eSIMs</Text>
                <Text style={styles.emptyStateText}>
                  Purchase your first eSIM to get started with global connectivity
                </Text>
                <Button
                  title="Explore Plans"
                  onPress={() => navigation.navigate('Explore')}
                  style={styles.emptyStateButton}
                />
              </View>
            </CardBody>
          </Card>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active eSIMs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyESIMs')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {activeESIMs.slice(0, 3).map((esim) => (
            <Card key={esim.id} style={styles.esimCard}>
              <CardBody>
                <View style={styles.esimHeader}>
                  <Text style={styles.esimCountry}>{esim.plan.country.name}</Text>
                  <Text style={styles.esimFlag}>{esim.plan.country.flag}</Text>
                </View>
                <Text style={styles.esimPlan}>{esim.plan.name}</Text>
                <View style={styles.esimDetails}>
                  <Text style={styles.esimData}>
                    {formatDataUsage(esim.dataRemaining)} remaining
                  </Text>
                  <Text style={styles.esimExpiry}>
                    {formatTimeRemaining(esim.expiryDate!)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.esimAction}
                  onPress={() => navigation.navigate('ESIMDetails', { eSIM: esim })}
                >
                  <Text style={styles.esimActionText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </CardBody>
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPopularPlans = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Plans</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {popularPlans.slice(0, 3).map((plan) => (
          <Card key={plan.id} style={styles.planCard}>
            <CardBody>
              <View style={styles.planHeader}>
                <Text style={styles.planCountry}>{plan.country.name}</Text>
                <Text style={styles.planFlag}>{plan.country.flag}</Text>
              </View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planData}>{formatDataUsage(plan.dataAmount)}</Text>
              <Text style={styles.planDuration}>{plan.duration} days</Text>
              <Text style={styles.planPrice}>
                {formatCurrency(plan.price, plan.currency)}
              </Text>
              <Button
                title="View Plan"
                onPress={() => navigation.navigate('PlanDetails', { plan })}
                size="small"
                fullWidth
              />
            </CardBody>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>
              {user?.firstName || 'Traveler'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {user?.profileImage ? (
              <Text style={styles.profileImage}>👤</Text>
            ) : (
              <Text style={styles.profileInitials}>
                {getInitials(user?.firstName || 'U', user?.lastName || 'S')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Active eSIMs */}
      {renderActiveESIMs()}

      {/* Popular Plans */}
      {renderPopularPlans()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    fontSize: 24,
  },
  profileInitials: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.surface,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyStateButton: {
    marginTop: SPACING.md,
  },
  esimCard: {
    width: 200,
    marginRight: SPACING.md,
  },
  esimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  esimCountry: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  esimFlag: {
    fontSize: 20,
  },
  esimPlan: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  esimDetails: {
    marginBottom: SPACING.md,
  },
  esimData: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  esimExpiry: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  esimAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  esimActionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },
  planCard: {
    width: 180,
    marginRight: SPACING.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  planCountry: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  planFlag: {
    fontSize: 20,
  },
  planName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  planData: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  planDuration: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  planPrice: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
});