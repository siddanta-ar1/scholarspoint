// Utility functions for opportunity deadline handling

export type DeadlineStatus = "expired" | "urgent" | "soon" | "open" | null;

/**
 * Check if an opportunity deadline has passed
 */
export function isExpired(deadline: string | null | undefined): boolean {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
}

/**
 * Calculate days remaining until deadline
 * Returns negative number if expired
 */
export function getDaysRemaining(deadline: string | null | undefined): number | null {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Get deadline status with color and label info
 */
export function getDeadlineStatus(deadline: string | null | undefined): {
    status: DeadlineStatus;
    label: string;
    color: string;
    bgColor: string;
} | null {
    if (!deadline) return null;

    const daysLeft = getDaysRemaining(deadline);
    if (daysLeft === null) return null;

    if (daysLeft < 0) {
        return {
            status: "expired",
            label: "Expired",
            color: "text-red-700",
            bgColor: "bg-red-100",
        };
    }

    if (daysLeft === 0) {
        return {
            status: "urgent",
            label: "Last Day!",
            color: "text-red-700",
            bgColor: "bg-red-500",
        };
    }

    if (daysLeft <= 3) {
        return {
            status: "urgent",
            label: `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`,
            color: "text-white",
            bgColor: "bg-red-500",
        };
    }

    if (daysLeft <= 7) {
        return {
            status: "soon",
            label: `${daysLeft} days left`,
            color: "text-white",
            bgColor: "bg-orange-500",
        };
    }

    if (daysLeft <= 30) {
        return {
            status: "open",
            label: `${daysLeft} days left`,
            color: "text-white",
            bgColor: "bg-green-600",
        };
    }

    return {
        status: "open",
        label: `${daysLeft} days left`,
        color: "text-white",
        bgColor: "bg-sky-600",
    };
}

/**
 * Format deadline date for display
 */
export function formatDeadline(deadline: string | null | undefined): string {
    if (!deadline) return "No deadline";

    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Sort opportunities by deadline (active first, then by closest deadline)
 */
export function sortByDeadline<T extends { deadline: string | null }>(
    opportunities: T[],
    showExpired: boolean = true
): T[] {
    return opportunities
        .filter((opp) => showExpired || !isExpired(opp.deadline))
        .sort((a, b) => {
            const aExpired = isExpired(a.deadline);
            const bExpired = isExpired(b.deadline);

            // Active opportunities come first
            if (aExpired !== bExpired) {
                return aExpired ? 1 : -1;
            }

            // If both have same expired status, sort by deadline
            if (!a.deadline && !b.deadline) return 0;
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;

            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
}
