const PricingLimits = {
    FREE_PLAN: {
        MAX_SCHEDULES: 7,
        MAX_ROLES: 3,
        MAX_ROLE_CAPACITY: 10
    },
    PREMIUM_PLAN: {
        MAX_SCHEDULES: 15,
        MAX_ROLES: 5,
        MAX_ROLE_CAPACITY: 20
    },
    ENTERPRISE_PLAN: {
        MAX_SCHEDULES: Infinity,
        MAX_ROLES: Infinity,
        MAX_ROLE_CAPACITY: 50
    }
}

export default PricingLimits