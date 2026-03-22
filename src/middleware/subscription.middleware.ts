import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { UserSubscription, SubscriptionStatus } from '../entities/user-subscription.entity';
import { SubscriptionPlan, SubscriptionTier } from '../entities/subscription-plan.entity';
import { AppError } from '../utils/errors';
import { auditService } from '../services/audit.service';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolves the active SubscriptionPlan for the given userId.
 * Falls back to the FREE tier if no active subscription exists.
 * Lazy lazy — only runs DB queries when a guard actually needs it.
 */
async function getActivePlan(userId: string): Promise<SubscriptionPlan> {
  const planRepo = AppDataSource.getRepository(SubscriptionPlan);
  const subRepo = AppDataSource.getRepository(UserSubscription);
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ id: userId });

  const sub = user?.companyId
    ? await subRepo.findOne({
        where: {
          companyId: user.companyId,
          status: SubscriptionStatus.ACTIVE,
        },
        relations: ['plan'],
        order: { createdAt: 'DESC' },
      })
    : null;

  if (sub?.plan) return sub.plan;

  // Fall back to the FREE tier definition
  const freePlan = await planRepo.findOne({
    where: { tier: SubscriptionTier.FREE },
  });

  if (!freePlan) {
    throw new AppError(
      'Subscription plans not seeded. Run: npm run seed:subscriptions',
      500,
    );
  }

  return freePlan;
}

// ─── Numeric limit guard ──────────────────────────────────────────────────────

type NumericFeature = 'maxProjects' | 'maxTeamMembers';

/**
 * limitGuard('maxProjects')
 *
 * Checks whether the company has reached the numeric limit for the given
 * feature on their active plan. Inserts a LIMIT_REACHED audit log event
 * (fire-and-forget) if they have, then returns 403.
 *
 * Usage:
 *   router.post('/', protect, limitGuard('maxProjects'), createProject);
 */
export const limitGuard = (feature: NumericFeature) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));

    try {
      const plan = await getActivePlan(req.user.id);
      const limit: number = plan[feature] as number;
      const companyId = req.user.companyId;
      let currentCount = 0;

      if (feature === 'maxProjects') {
        currentCount = await AppDataSource.getRepository(Project).count({
          where: { companyId },
        });
      } else if (feature === 'maxTeamMembers') {
        currentCount = await AppDataSource.getRepository(User).count({
          where: { companyId },
        });
      }

      if (currentCount >= limit) {
        // 📊 Phase 2: Fire-and-forget upsell audit event
        auditService.log({
          actorId: req.user.id,
          action: 'LIMIT_REACHED',
          resourceType: feature,
          payload: {
            currentCount,
            limit,
            plan: plan.name,
            tier: plan.tier,
            companyId,
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
        });

        const label =
          feature === 'maxProjects' ? 'projects' : 'team members';

        return next(
          new AppError(
            `Your ${plan.name} plan allows a maximum of ${limit} ${label}. ` +
              `Please upgrade to add more.`,
            403,
          ),
        );
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

// ─── Boolean feature flag guard ───────────────────────────────────────────────

type BooleanFeature = 'customRulesets' | 'apiAccess' | 'advancedAnalytics';

/**
 * featureGuard('customRulesets')
 *
 * Checks whether the company's active plan includes a boolean feature flag.
 * Inserts a FEATURE_BLOCKED audit log event (fire-and-forget) and returns 403
 * if the feature is not included.
 *
 * Usage:
 *   router.post('/', protect, featureGuard('customRulesets'), createRuleset);
 */
export const featureGuard = (feature: BooleanFeature) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));

    try {
      const plan = await getActivePlan(req.user.id);
      const hasFeature = plan[feature] as boolean;

      if (!hasFeature) {
        // 📊 Phase 2: Fire-and-forget upsell audit event
        auditService.log({
          actorId: req.user.id,
          action: 'FEATURE_BLOCKED',
          resourceType: feature,
          payload: {
            plan: plan.name,
            tier: plan.tier,
            companyId: req.user.companyId,
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] as string,
        });

        return next(
          new AppError(
            `Your ${plan.name} plan does not include access to this feature. ` +
              `Please upgrade to unlock it.`,
            403,
          ),
        );
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
